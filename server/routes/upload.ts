import { RequestHandler } from "express";
import { supabaseAdmin } from "../lib/supabase";

/**
 * Validador de firmas binarias (Magic Bytes) para imágenes permitidas
 */
function detectImageType(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.length < 12) return null;

  // JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }

  // PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png", ext: "png" };
  }

  // WEBP (RIFF .... WEBP)
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mime: "image/webp", ext: "webp" };
  }

  return null;
}

export const uploadImage: RequestHandler = async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({
        error: "Datos de imagen requeridos",
      });
    }

    // Convertir base64 a buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(base64Data, "base64");

    // Límite estricto de tamaño: 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: "El archivo excede el tamaño máximo permitido (5MB)",
      });
    }

    // Inspección profunda de Magic Bytes (bloquea PHP, SVG maliciosos, ejecutables)
    const detectedType = detectImageType(fileBuffer);
    if (!detectedType) {
      return res.status(400).json({
        error: "Formato no permitido. Solo se aceptan imágenes legítimas JPEG, PNG o WEBP.",
      });
    }

    // Nombre seguro generado en backend
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const path = `products/${uniqueSuffix}.${detectedType.ext}`;

    // Subir a Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(path, fileBuffer, {
        contentType: detectedType.mime,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      return res.status(400).json({
        error: "Error al almacenar el archivo",
      });
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);

    res.json({
      url: publicUrl,
      path: path,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Error interno al procesar el archivo",
    });
  }
};

export const deleteImage: RequestHandler = async (req, res) => {
  try {
    const { path } = req.body;

    if (!path || typeof path !== "string") {
      return res.status(400).json({
        error: "Ruta de archivo requerida",
      });
    }

    // Sanitización anti-Path-Traversal: Debe iniciar con "products/" y caracteres alfanuméricos seguros
    const safePathRegex = /^products\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)$/;
    if (!safePathRegex.test(path) || path.includes("..")) {
      return res.status(400).json({
        error: "Ruta de archivo no permitida",
      });
    }

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([path]);

    if (error) {
      return res.status(400).json({
        error: "No se pudo eliminar el archivo",
      });
    }

    res.json({
      success: true,
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Error interno al eliminar el archivo",
    });
  }
};
