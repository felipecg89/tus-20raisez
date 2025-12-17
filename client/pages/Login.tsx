import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación de contraseña para sign up
    if (isSignUp && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, "cliente");
      } else {
        await signIn(email, password);
      }
      navigate("/admin");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error de autenticación";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">
            {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={loading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
              {isSignUp && (
                <p className={`text-xs mt-1 ${password.length >= 6 ? "text-emerald-500" : "text-slate-400"}`}>
                  Mínimo 6 caracteres {password.length >= 6 ? "✓" : ""}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || (isSignUp && password.length < 6)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cargando..." : isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-emerald-500 hover:text-emerald-400"
              >
                {isSignUp
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Crear una"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
