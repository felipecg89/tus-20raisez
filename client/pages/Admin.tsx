import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { AdminStats } from "@shared/api";
import { Package, Mail, FileText, TrendingUp } from "lucide-react";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminContent from "@/components/admin/AdminContent";

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats({
        ...data,
        totalProducts: 0,
        lastUpdated: new Date().toISOString(),
      });

      const productsResponse = await fetch("/api/products");
      const products = await productsResponse.json();
      setStats((prev) =>
        prev
          ? { ...prev, totalProducts: products.length }
          : {
              totalProducts: products.length,
              totalMessages: 0,
              unreadMessages: 0,
              lastUpdated: new Date().toISOString(),
            }
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Ene", products: 4, messages: 24 },
    { name: "Feb", products: 3, messages: 13 },
    { name: "Mar", products: 2, messages: 9 },
    { name: "Abr", products: 5, messages: 28 },
    { name: "May", products: 6, messages: 39 },
    { name: "Jun", products: 7, messages: 43 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel Administrativo</h1>
          <p className="text-slate-400">Gestiona productos, mensajes y contenido</p>
        </div>

        {/* Stats Grid */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Productos</CardTitle>
                <Package className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                <p className="text-xs text-slate-400">Activos en el sistema</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Mensajes</CardTitle>
                <Mail className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
                <p className="text-xs text-slate-400">Total recibidos</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Sin leer</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.unreadMessages}</div>
                <p className="text-xs text-slate-400">Requieren atención</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Contenido</CardTitle>
                <FileText className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">5</div>
                <p className="text-xs text-slate-400">Bloques activos</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Actividad Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="products" fill="#10b981" name="Productos" />
                  <Bar dataKey="messages" fill="#3b82f6" name="Mensajes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Tendencia de Crecimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#3b82f6" 
                    name="Mensajes"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="products" 
                    stroke="#10b981" 
                    name="Productos"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Gestión de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="products" className="data-[state=active]:bg-emerald-600">
                  Productos
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600">
                  Mensajes
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-violet-600">
                  Contenido
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4">
                <AdminProducts onUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="messages" className="mt-4">
                <AdminMessages onUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="content" className="mt-4">
                <AdminContent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
