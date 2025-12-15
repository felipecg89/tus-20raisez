import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoUserResult {
  email: string;
  role?: string;
  password?: string;
  status: string;
  description?: string;
  error?: string;
}

interface CreateUsersResponse {
  message: string;
  results: DemoUserResult[];
  summary: {
    total: number;
    created: number;
    failed: number;
    already_exists: number;
  };
}

export default function DevSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DemoUserResult[]>([]);
  const { toast } = useToast();

  const createDemoUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/create-demo-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creating demo users");
      }

      const data: CreateUsersResponse = await response.json();
      setResults(data.results);

      toast({
        title: "¡Éxito!",
        description: `Se crearon ${data.summary.created} usuarios de prueba`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error creating demo users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">🛠️ Setup de Desarrollo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning */}
            <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">Solo Desarrollo</p>
                <p className="text-sm text-amber-200/80">
                  Esta página solo funciona en ambiente de desarrollo. Crea usuarios de prueba con diferentes roles.
                </p>
              </div>
            </div>

            {/* Button */}
            <Button
              onClick={createDemoUsers}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando usuarios...
                </>
              ) : (
                "Crear Usuarios de Prueba"
              )}
            </Button>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Resultados:</h3>
                {results.map((user, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      user.status === "created"
                        ? "bg-emerald-500/10 border-emerald-500/50"
                        : user.status === "already_exists"
                          ? "bg-blue-500/10 border-blue-500/50"
                          : "bg-red-500/10 border-red-500/50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {user.status === "created" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white">{user.email}</p>
                        {user.description && (
                          <p className="text-sm text-slate-400 mb-2">{user.description}</p>
                        )}
                        {user.status === "created" && (
                          <div className="text-xs text-slate-400 space-y-1 bg-black/20 p-2 rounded mt-2 font-mono">
                            <p>
                              <span className="text-slate-500">Email:</span> {user.email}
                            </p>
                            <p>
                              <span className="text-slate-500">Contraseña:</span> {user.password}
                            </p>
                            <p>
                              <span className="text-slate-500">Rol:</span>{" "}
                              <span className="capitalize">{user.role}</span>
                            </p>
                          </div>
                        )}
                        {user.error && (
                          <p className="text-sm text-red-400 mt-1">{user.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-slate-700/50 rounded-lg space-y-2 text-sm text-slate-300">
              <p className="font-semibold text-slate-200">📋 Información:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Se crearán 3 usuarios: admin, agente y cliente</li>
                <li>Las contraseñas están en el resultado arriba</li>
                <li>Usa estas credenciales para probar la aplicación</li>
                <li>Administrador: acceso a `/admin` y `/agentes`</li>
                <li>Agente: acceso a `/agentes` únicamente</li>
                <li>Cliente: acceso solo a páginas públicas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
