import { useState } from "react";
import { Product, PRODUCT_CATEGORIES } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Edit2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/uploadService";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export default function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: ProductDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    city: product?.city || "",
    type: (product?.type as "casa" | "terreno") || "casa",
    category: product?.category || "venta_casa",
    image: product?.image || "",
    features: product?.features.join(", ") || "",
  });
  const [imagePreview, setImagePreview] = useState(product?.image || "");

  if (!product) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

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

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.city) {
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

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error updating product");

      toast.success("Producto actualizado");
      setIsEditing(false);
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar el producto");
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      onDelete(product.id);
      onOpenChange(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return PRODUCT_CATEGORIES.find((c) => c.value === category)?.labelEs || category;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto bg-slate-700 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Editar Producto" : "Detalles del Producto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isEditing ? (
            // Vista de solo lectura
            <div className="space-y-4">
              {product.image && (
                <div className="w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Nombre</p>
                  <p className="text-white font-semibold">{product.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ciudad</p>
                  <p className="text-white font-semibold">{product.city}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Precio</p>
                  <p className="text-emerald-400 font-bold">${product.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Tipo</p>
                  <p className="text-white font-semibold capitalize">{product.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Categoría</p>
                  <p className="text-blue-400 font-semibold">{getCategoryLabel(product.category)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Creado</p>
                  <p className="text-slate-300 text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Descripción</p>
                <p className="text-slate-300 text-sm">{product.description}</p>
              </div>

              {product.features.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Características</p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs bg-slate-600 text-slate-200 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Formulario de edición
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />

              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <Input
                  placeholder="Precio"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as "casa" | "terreno" })
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

                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.labelEs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
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
                    <div className="flex items-center justify-center w-full h-10 bg-slate-600 border border-slate-500 rounded cursor-pointer hover:bg-slate-500">
                      <Upload className="h-4 w-4 text-slate-300 mr-2" />
                      <span className="text-sm text-slate-300">
                        {uploading ? "Subiendo..." : "Cambiar"}
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
                      className="px-3 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-sm h-auto mt-2 rounded border border-slate-500"
                  />
                )}
              </div>

              <Textarea
                placeholder="Características (separadas por coma)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-slate-600 hover:bg-slate-500"
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-slate-600 hover:bg-slate-500"
              >
                Cerrar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
