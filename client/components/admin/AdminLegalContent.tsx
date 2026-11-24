import { useState, useEffect } from "react";
import { LegalArticle } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminLegalContent() {
  const [articles, setArticles] = useState<LegalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "ley" as "ley" | "imss" | "infonavit" | "notarial" | "general",
    summary: "",
    content: "",
    importantNotice: "",
    published: true,
    order: 0,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/legal-articles");
      if (!res.ok) throw new Error("Error fetching articles");
      const data = await res.json();
      setArticles(data);
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar artículos de leyes y trámites");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: LegalArticle) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: article.content,
      importantNotice: article.importantNotice || "",
      published: article.published,
      order: article.order || 0,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: "",
      category: "ley",
      summary: "",
      content: "",
      importantNotice: "",
      published: true,
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Por favor completa el título y el contenido");
      return;
    }

    try {
      const url = editingId ? `/api/legal-articles/${editingId}` : "/api/legal-articles";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error saving article");

      toast.success(editingId ? "Aviso legal actualizado" : "Nuevo aviso legal publicado");
      handleCancel();
      fetchArticles();
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el aviso legal");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este artículo de la página?")) return;

    try {
      const res = await fetch(`/api/legal-articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting article");
      toast.success("Artículo eliminado");
      fetchArticles();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar el artículo");
    }
  };

  const categoryLabels: Record<string, string> = {
    ley: "Reforma / Ley Mexicana",
    imss: "IMSS / Modalidad 40",
    infonavit: "Infonavit Sin Fronteras",
    notarial: "Poderes y Escrituras Notariales",
    general: "Trámites Generales",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
            <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 shrink-0" />
            <span>Leyes, Reformas y Trámites para Paisanos</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Publica y actualiza información legal, cambios en el IMSS, Infonavit y convenios consulares que se reflejan en vivo en el sitio web.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              handleCancel();
              setShowForm(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Aviso / Ley
          </Button>
        )}
      </div>

      {/* Formulario de alta / edición */}
      {showForm && (
        <Card className="bg-slate-700/80 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {editingId ? "Editar Aviso / Artículo Legal" : "Crear Nuevo Aviso o Reforma Legal"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Título del Aviso o Reforma Legal *
                  </label>
                  <Input
                    required
                    placeholder="Ej. Nueva normativa para poderes notariales consulares 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Categoría del Trámite *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      <SelectItem value="ley" className="text-white">Reforma / Ley Mexicana</SelectItem>
                      <SelectItem value="imss" className="text-white">IMSS / Modalidad 40</SelectItem>
                      <SelectItem value="infonavit" className="text-white">Infonavit Sin Fronteras</SelectItem>
                      <SelectItem value="notarial" className="text-white">Poderes y Escrituras Notariales</SelectItem>
                      <SelectItem value="general" className="text-white">Trámites Generales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Resumen Corto (Aparece en tarjetas y listados)
                </label>
                <Input
                  placeholder="Ej. Resumen de los requisitos y vigencia del trámite para paisanos"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Explicación Detallada / Contenido Legal *
                </label>
                <Textarea
                  required
                  rows={5}
                  placeholder="Explica detalladamente la ley, cómo beneficia al paisano, pasos a seguir y documentos necesarios..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-amber-400 block mb-1">
                  Nota de Advertencia Importante (Aparecerá destacada en amarillo en el frontend)
                </label>
                <Input
                  placeholder="Ej. Recuerda que este trámite requiere cita previa en el consulado mexicano de tu ciudad"
                  value={formData.importantNotice}
                  onChange={(e) => setFormData({ ...formData, importantNotice: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Guardar Cambios" : "Publicar Aviso"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="text-slate-300 border-slate-500">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de artículos */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando avisos legales...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-800/50 rounded-xl border border-slate-700">
            No hay artículos ni avisos registrados aún. Haz clic en "Nuevo Aviso / Ley" para crear el primero.
          </div>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Actualizado: {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{article.title}</h3>
                  <p className="text-slate-300 text-sm">{article.summary || article.content.substring(0, 160) + "..."}</p>
                  {article.importantNotice && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/40">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{article.importantNotice}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(article)}
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    <Edit2 className="h-4 w-4 mr-1.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-600/80 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
