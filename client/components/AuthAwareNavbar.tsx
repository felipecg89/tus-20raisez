import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export const AuthAwareNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            Propiedades Pro
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-300">{user?.email}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/admin")}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-300">{user?.email}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <Button
                  onClick={() => {
                    navigate("/admin");
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
