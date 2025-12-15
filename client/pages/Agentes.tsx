import { useAuth } from "@/contexts/AuthContext";
import { AuthAwareNavbar } from "@/components/AuthAwareNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Code2, Home, Users } from "lucide-react";

export default function Agentes() {
  const { user } = useAuth();

  const isAgentOrAdmin = user?.role === "agente" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AuthAwareNavbar />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Agentes</h1>
          <p className="text-slate-400">
            Bienvenido, <span className="text-emerald-400">{user?.email}</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card: Gestionar Propiedades - Visible para agentes y admins */}
          {isAgentOrAdmin && (
            <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Home className="h-5 w-5" />
                  Gestionar Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400">
                  Accede a Supabase Studio para gestionar tus propiedades directamente.
                </p>
                <Button
                  onClick={() =>
                    window.open(
                      "https://supabase.com/dashboard/project/ajnenxygedrazpvjdbdo",
                      "_blank"
                    )
                  }
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Abrir Supabase Studio
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Card: Panel de Control Global - Visible solo para admins */}
          {user?.role === "admin" && (
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Users className="h-5 w-5" />
                  Panel de Control Global
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400">
                  Gestiona usuarios, roles y configuraciones del sistema.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Acceder al Panel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Card: Editar Diseño de Web - Visible solo para admins */}
          {user?.role === "admin" && (
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Code2 className="h-5 w-5" />
                  Editar Diseño de Web
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400">
                  Accede a la consola de Builder.io para editar el contenido y diseño del sitio.
                </p>
                <Button
                  onClick={() => window.open("https://builder.io/app/content", "_blank")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  Consola de Builder.io
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs for more detailed information */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Información de Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="bg-slate-700 border-slate-600">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-slate-600 text-slate-300"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="data-[state=active]:bg-slate-600 text-slate-300"
                >
                  Permisos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Rol</p>
                    <p className="text-white font-medium capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">ID de Usuario</p>
                    <p className="text-white font-mono text-sm">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cuenta Creada</p>
                    <p className="text-white font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "N/A"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-300">
                      {isAgentOrAdmin ? "✓" : "✗"} Gestionar Propiedades
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${user?.role === "admin" ? "bg-blue-500" : "bg-slate-600"}`}></div>
                    <span className="text-slate-300">
                      {user?.role === "admin" ? "✓" : "✗"} Panel de Control Global
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${user?.role === "admin" ? "bg-purple-500" : "bg-slate-600"}`}></div>
                    <span className="text-slate-300">
                      {user?.role === "admin" ? "✓" : "✗"} Editar Diseño Web
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
