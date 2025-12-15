import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Trash2, Edit2, Plus } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface CreateUserForm {
  email: string;
  password: string;
  role: UserRole;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<CreateUserForm>({
    email: "",
    password: "",
    role: "cliente",
  });
  const [editingRole, setEditingRole] = useState<UserRole>("cliente");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Error fetching users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Email y contraseña son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creating user");
      }

      toast({
        title: "Éxito",
        description: "Usuario creado exitosamente",
      });

      setNewUser({ email: "", password: "", role: "cliente" });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error creating user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editingRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error updating user");
      }

      toast({
        title: "Éxito",
        description: "Rol actualizado exitosamente",
      });

      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error updating user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      const response = await fetch(`/api/users/${deleteUserId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error deleting user");
      }

      toast({
        title: "Éxito",
        description: "Usuario eliminado exitosamente",
      });

      setDeleteUserId(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error deleting user",
        variant: "destructive",
      });
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Solo los administradores pueden gestionar usuarios.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showCreateForm ? "Cancelar" : "Nuevo Usuario"}
        </Button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Crear Nuevo Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rol
                </label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value as UserRole })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="agente">Agente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Crear Usuario
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabla de usuarios */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando usuarios...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No hay usuarios</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="border-b border-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Rol</th>
                <th className="px-4 py-3 text-left font-semibold">Creado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50"
                >
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {editingUserId === u.id ? (
                      <Select
                        value={editingRole}
                        onValueChange={(value) =>
                          setEditingRole(value as UserRole)
                        }
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-white w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="agente">Agente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-slate-700 rounded text-xs font-medium capitalize">
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(u.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingUserId === u.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRole(u.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUserId(null)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-700 border-slate-600"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUserId(u.id);
                              setEditingRole(u.role);
                            }}
                            className="text-slate-200 cursor-pointer hover:bg-slate-600"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar Rol
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteUserId(u.id)}
                            className="text-red-400 cursor-pointer hover:bg-slate-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. El usuario y sus datos serán
              eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
