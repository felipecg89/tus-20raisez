import { useState, useEffect } from "react";
import { ContentBlock } from "@shared/api";
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
import { Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminContent() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newBlock, setNewBlock] = useState({
    section: "hero",
    key: "",
    value: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/content");
      const data = await response.json();
      setContentBlocks(data);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Error al cargar contenido");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editValue }),
      });

      if (!response.ok) throw new Error("Error updating content");

      toast.success("Contenido actualizado");
      setEditingId(null);
      fetchContent();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar el contenido");
    }
  };

  const handleCreateNew = async () => {
    if (!newBlock.key || !newBlock.value) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlock),
      });

      if (!response.ok) throw new Error("Error creating content");

      toast.success("Bloque de contenido creado");
      setNewBlock({ section: "hero", key: "", value: "" });
      setShowNewForm(false);
      fetchContent();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear el bloque de contenido");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este bloque?"))
      return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error deleting content");

      toast.success("Bloque eliminado");
      fetchContent();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el bloque");
    }
  };

  const sections = [
    { value: "hero", label: "Sección Hero" },
    { value: "services", label: "Servicios" },
    { value: "benefits", label: "Beneficios" },
    { value: "footer", label: "Footer" },
    { value: "other", label: "Otro" },
  ];

  const groupedContent = contentBlocks.reduce(
    (acc, block) => {
      if (!acc[block.section]) acc[block.section] = [];
      acc[block.section].push(block);
      return acc;
    },
    {} as Record<string, ContentBlock[]>
  );

  if (loading) {
    return <div className="text-slate-400">Cargando contenido...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Bloques de Contenido ({contentBlocks.length})
        </h3>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Bloque
        </Button>
      </div>

      {/* New Block Form */}
      {showNewForm && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Crear Nuevo Bloque de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={newBlock.section} onValueChange={(value) =>
                setNewBlock({ ...newBlock, section: value })
              }>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-600 border-slate-500">
                  {sections.map((section) => (
                    <SelectItem key={section.value} value={section.value} className="text-white">
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Clave (ej: hero-title)"
                value={newBlock.key}
                onChange={(e) => setNewBlock({ ...newBlock, key: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />

              <Textarea
                placeholder="Valor del contenido"
                value={newBlock.value}
                onChange={(e) => setNewBlock({ ...newBlock, value: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 min-h-32"
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateNew}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Crear Bloque
                </Button>
                <Button
                  onClick={() => setShowNewForm(false)}
                  className="bg-slate-600 hover:bg-slate-500"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Blocks by Section */}
      {Object.entries(groupedContent).map(([section, blocks]) => (
        <div key={section}>
          <h4 className="text-md font-semibold text-slate-300 mb-3 capitalize">
            {sections.find((s) => s.value === section)?.label || section}
          </h4>
          <div className="space-y-2">
            {blocks.map((block) => (
              <Card key={block.id} className="bg-slate-700 border-slate-600">
                <CardContent className="pt-4">
                  {editingId === block.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 min-h-24"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveEdit(block.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-600 hover:bg-slate-500"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {block.key}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Actualizado:{" "}
                            {new Date(block.updatedAt).toLocaleString("es-MX")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingId(block.id);
                              setEditValue(block.value);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(block.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap break-words">
                        {typeof block.value === "string"
                          ? block.value
                          : JSON.stringify(block.value, null, 2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {contentBlocks.length === 0 && !showNewForm && (
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="pt-6">
            <p className="text-center text-slate-400">
              No hay bloques de contenido. ¡Crea uno nuevo para empezar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
