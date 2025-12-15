import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, ProductCategory, PRODUCT_CATEGORIES } from "@shared/api";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Upload, X, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { uploadProductImage, MediaFile } from "@/lib/uploadService";
import ProductMediaGallery from "@/components/admin/ProductMediaGallery";

export default function AdminProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "casa" as "casa" | "terreno",
    category: "venta_casa" as ProductCategory,
    image: "",
    features: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Producto no encontrado");
      
      const data: Product = await response.json();
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        city: data.city,
        address: data.address || "",
        latitude: data.latitude?.toString() || "",
        longitude: data.longitude?.toString() || "",
        type: data.type,
        category: data.category,
        image: data.image,
        features: data.features.join(", "),
      });
      setImagePreview(data.image);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error updating product");

      toast.success("Producto actualizado correctamente");
      navigate("/admin", { state: { tab: "productos" } });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error deleting product");

      toast.success("Producto eliminado correctamente");
      navigate("/admin", { state: { tab: "productos" } });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex items-center justify-center">
        <p className="text-white text-lg">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="mb-4 text-white border-slate-600 hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-6">
              <p className="text-center text-slate-400">Producto no encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="text-white border-slate-600 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del Producto
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 min-h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Ciudad
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Precio (USD)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo
                    </label>
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
                        <SelectItem value="casa" className="text-white">Casa</SelectItem>
                        <SelectItem value="terreno" className="text-white">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value as ProductCategory })
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dirección Completa
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="Ej: Calle Principal 123, Centro, Ciudad, Estado"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Latitud
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      placeholder="Ej: 19.4326"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Longitud
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      placeholder="Ej: -99.1332"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Características (separadas por coma)
                  </label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="Ej: 3 recámaras, piscina, jardín"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Section */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Imagen Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg border border-slate-500"
                    />
                  </div>
                )}
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
                        {uploading ? "Subiendo..." : "Cambiar Imagen"}
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

                <Alert className="bg-blue-900/20 border-blue-500/30">
                  <AlertDescription className="text-blue-200 text-sm">
                    📸 <strong>Formatos de Imagen:</strong> JPG, PNG, WebP | Máx 5MB | Se comprime automáticamente
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => navigate("/admin")}
                className="bg-slate-600 hover:bg-slate-500"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Producto
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>

          {/* Right Column - Media Gallery */}
          <div>
            <ProductMediaGallery
              productId={id}
              mediaList={mediaList}
              onMediaAdded={(media) => setMediaList([...mediaList, media])}
              onMediaRemoved={(path) =>
                setMediaList(mediaList.filter((m) => m.path !== path))
              }
            />

            {/* Format Guidelines */}
            <Card className="bg-slate-700 border-slate-600 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-sm">Formatos Aceptados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">📸 Fotos</p>
                  <p className="text-xs text-slate-400">
                    JPG, PNG, WebP
                  </p>
                  <p className="text-xs text-slate-500">
                    Máx: 5 MB
                  </p>
                  <p className="text-xs text-slate-500">
                    Se comprimen automáticamente
                  </p>
                </div>

                <div className="border-t border-slate-600 pt-3">
                  <p className="text-xs font-semibold text-slate-300 mb-1">🎥 Videos</p>
                  <p className="text-xs text-slate-400">
                    MP4, WebM, MOV
                  </p>
                  <p className="text-xs text-slate-500">
                    Máx: 50 MB
                  </p>
                  <p className="text-xs text-slate-500">
                    Resolución recomendada: 1080p
                  </p>
                </div>

                <div className="border-t border-slate-600 pt-3">
                  <p className="text-xs font-semibold text-slate-300 mb-1">💡 Tips</p>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li>Máx 100 archivos por carga</li>
                    <li>Subidas en lote para rapidez</li>
                    <li>Puedes reordenar los medios</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
