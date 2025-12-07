import { useState, useEffect } from "react";
import { Product } from "@shared/api";
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
import { Trash2, Edit2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/uploadService";

interface AdminProductsProps {
  onUpdate: () => void;
}

export default function AdminProducts({ onUpdate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    type: "casa" as "casa" | "terreno",
    image: "",
    features: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.city
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };

      if (editing) {
        const response = await fetch(`/api/products/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error updating product");

        toast.success("Producto actualizado");
        setEditing(null);
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error creating product");

        toast.success("Producto creado");
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        city: "",
        type: "casa",
        image: "",
        features: "",
      });
      setShowForm(false);
      fetchProducts();
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar el producto");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      city: product.city,
      type: product.type,
      image: product.image,
      features: product.features.join(", "),
    });
    setImagePreview(product.image);
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error deleting product");

      toast.success("Producto eliminado");
      fetchProducts();
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      setUploading(true);
      const url = await uploadProductImage(file);
      setFormData({ ...formData, image: url });
      setImagePreview(url);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      city: "",
      type: "casa",
      image: "",
      features: "",
    });
    setImagePreview("");
  };

  if (loading) {
    return <div className="text-slate-400">Cargando productos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Productos ({products.length})</h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editing ? "Editar Producto" : "Crear Nuevo Producto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre del producto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <Input
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
              </div>

              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Precio"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />

                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "casa" | "terreno",
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    <SelectItem value="casa" className="text-white">
                      Casa
                    </SelectItem>
                    <SelectItem value="terreno" className="text-white">
                      Terreno
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Imagen
                  </label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center w-full h-10 bg-slate-600 border border-slate-500 rounded cursor-pointer hover:bg-slate-500 transition-colors">
                        <Upload className="h-4 w-4 text-slate-300 mr-2" />
                        <span className="text-sm text-slate-300">
                          {uploading ? "Subiendo..." : "Seleccionar"}
                        </span>
                      </div>
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: "" });
                          setImagePreview("");
                        }}
                        className="px-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="Características (separadas por coma)"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded border border-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Vista previa de la imagen</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editing ? "Guardar Cambios" : "Crear Producto"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="bg-slate-600 hover:bg-slate-500"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-slate-700 border-slate-600 overflow-hidden">
            {product.image && (
              <div className="w-full h-48 overflow-hidden bg-slate-600">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{product.name}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">{product.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    ${product.price.toLocaleString()}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs bg-slate-600 text-slate-200 rounded mt-1">
                    {product.type}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-3">{product.description}</p>
              {product.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 mb-2">Características:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-slate-600 text-slate-200 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="pt-6">
            <p className="text-center text-slate-400">
              No hay productos. ¡Crea uno nuevo para empezar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
