<?php
/**
 * Endpoint SMTP de respaldo para Hostinger Web Hosting (LiteSpeed / PHP)
 * Lee SMTP_USER y SMTP_PASS desde .env en el servidor (protegido por .htaccess)
 * y envía correo autenticado por SSL (puerto 465) a asesor-patrimonial@tusraices.click.
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

function loadEnvVariables(): array {
    $env = [];
    $candidates = [
        dirname(__DIR__, 2) . '/.env', // fuera de public_html (recomendado)
        dirname(__DIR__) . '/.env',    // en la raíz del sitio (protegido por .htaccess)
    ];

    foreach ($candidates as $file) {
        if (is_readable($file)) {
            $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines === false) continue;
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if ($trimmed === '' || strpos($trimmed, '#') === 0) continue;
                $parts = explode('=', $trimmed, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $val = trim($parts[1]);
                    $val = trim($val, "\"'");
                    $env[$key] = $val;
                }
            }
            break;
        }
    }

    foreach (['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO_EMAIL'] as $k) {
        $sysVal = getenv($k);
        if ($sysVal !== false && $sysVal !== '') {
            $env[$k] = $sysVal;
        }
    }

    return $env;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '{}', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido']);
    exit;
}

if (!empty($data['_honeypot'])) {
    http_response_code(201);
    echo json_encode(['id' => 'ok', 'emailSent' => true]);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$whatsapp = trim((string)($data['whatsapp'] ?? ''));
$email = strtolower(trim((string)($data['email'] ?? '')));
$city = trim((string)($data['city'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $whatsapp === '' || $email === '' || $city === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Campos requeridos faltantes']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de correo electrónico inválido']);
    exit;
}

$name = preg_replace('/[\r\n]+/', ' ', mb_substr($name, 0, 100));
$whatsapp = preg_replace('/[\r\n]+/', ' ', mb_substr($whatsapp, 0, 30));
$email = preg_replace('/[\r\n]+/', '', mb_substr($email, 0, 100));
$city = preg_replace('/[\r\n]+/', ' ', mb_substr($city, 0, 100));
$message = mb_substr($message, 0, 2000);

$env = loadEnvVariables();
$smtpHost = $env['SMTP_HOST'] ?? 'smtp.hostinger.com';
$smtpPort = (int)($env['SMTP_PORT'] ?? 465);
$smtpUser = $env['SMTP_USER'] ?? '';
$smtpPass = $env['SMTP_PASS'] ?? '';
$toEmail  = $env['CONTACT_TO_EMAIL'] ?? 'asesor-patrimonial@tusraices.click';

if ($smtpUser === '' || $smtpPass === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Configuración SMTP incompleta en el servidor (.env)', 'emailSent' => false]);
    exit;
}

function smtpExpect($socket, array $expectedCodes): string {
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException("Respuesta SMTP inesperada ($code)");
    }
    return $response;
}

function smtpSend($socket, string $cmd, array $expectedCodes): string {
    fwrite($socket, $cmd . "\r\n");
    return smtpExpect($socket, $expectedCodes);
}

try {
    $remote = ($smtpPort === 465 ? 'ssl://' : '') . $smtpHost . ':' . $smtpPort;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $socket = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new RuntimeException("No se pudo conectar a SMTP ($errno)");
    }
    stream_set_timeout($socket, 15);

    smtpExpect($socket, [220]);
    smtpSend($socket, 'EHLO tusraices.click', [250]);
    smtpSend($socket, 'AUTH LOGIN', [334]);
    smtpSend($socket, base64_encode($smtpUser), [334]);
    smtpSend($socket, base64_encode($smtpPass), [235]);
    smtpSend($socket, "MAIL FROM:<$smtpUser>", [250]);
    smtpSend($socket, "RCPT TO:<$toEmail>", [250, 251]);
    smtpSend($socket, 'DATA', [354]);

    $subject = '=?UTF-8?B?' . base64_encode("Nuevo prospecto web: $name ($city)") . '?=';
    $htmlName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $htmlWhatsapp = htmlspecialchars($whatsapp, ENT_QUOTES, 'UTF-8');
    $htmlEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $htmlCity = htmlspecialchars($city, ENT_QUOTES, 'UTF-8');
    $htmlMsg = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    $htmlBody = "<html><body style='font-family:Arial,sans-serif;color:#101B24;'>"
        . "<h2 style='color:#1B4965;'>Nueva Solicitud de Asesoría Patrimonial</h2>"
        . "<p><strong>Nombre:</strong> {$htmlName}</p>"
        . "<p><strong>WhatsApp / Teléfono:</strong> {$htmlWhatsapp}</p>"
        . "<p><strong>Correo:</strong> <a href='mailto:{$htmlEmail}'>{$htmlEmail}</a></p>"
        . "<p><strong>Ciudad:</strong> {$htmlCity}</p>"
        . ($message !== '' ? "<p><strong>Mensaje:</strong><br>{$htmlMsg}</p>" : "")
        . "</body></html>";

    $headers = [
        'Date: ' . date('r'),
        'From: "Tus Raices MX - Web" <' . $smtpUser . '>',
        'To: <' . $toEmail . '>',
        'Reply-To: <' . $email . '>',
        'Subject: ' . $subject,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];

    $payload = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($htmlBody)) . "\r\n.";
    smtpSend($socket, $payload, [250]);
    @fwrite($socket, "QUIT\r\n");
    fclose($socket);

    http_response_code(201);
    echo json_encode(['id' => (string)time(), 'emailSent' => true]);
} catch (Throwable $e) {
    error_log('[SMTP PHP] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo enviar el correo por SMTP', 'emailSent' => false]);
}
