import { useState, useEffect } from "react";
import { Product, PRODUCT_CATEGORIES, ProductCategory } from "@shared/api";
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
import { Trash2, Edit2, Plus, Upload, X, Filter, Grid3x3, List } from "lucide-react";
import { toast } from "sonner";
import { uploadProductImage, MediaFile } from "@/lib/uploadService";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductDetailModal from "./ProductDetailModal";
import ProductTableView from "./ProductTableView";

interface AdminProductsProps {
  onUpdate: () => void;
}

export default function AdminProducts({ onUpdate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    type: "casa" as "casa" | "terreno",
    category: "venta_casa" as ProductCategory,
    image: "",
    features: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "20");
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (categoryFilter) {
        params.append("category", categoryFilter);
      }

      const response = await fetch(`/api/products?${params}`);
      const result = await response.json();

      if (result.data) {
        setProducts(result.data);
        setTotalPages(result.pagination.totalPages);
      } else {
        setProducts(result);
      }
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
        category: formData.category,
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
        category: "venta_casa",
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
      category: product.category,
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
      category: "venta_casa",
      image: "",
      features: "",
    });
    setImagePreview("");
    setMediaList([]);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="text-slate-400">Cargando productos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Productos</h3>
            <div className="flex gap-1 border border-slate-600 rounded-lg p-1">
              <Button
                size="sm"
                onClick={() => setViewMode("cards")}
                className={`${
                  viewMode === "cards"
                    ? "bg-slate-600 text-white"
                    : "bg-transparent text-slate-400 hover:text-white"
                } transition-colors`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => setViewMode("table")}
                className={`${
                  viewMode === "table"
                    ? "bg-slate-600 text-white"
                    : "bg-transparent text-slate-400 hover:text-white"
                } transition-colors`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
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

        <div className="flex gap-2 flex-col md:flex-row">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 flex-1"
          />
          <Select value={categoryFilter} onValueChange={(value) => {
            setCategoryFilter(value === "all" ? "" : value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="bg-slate-600 border-slate-500 text-white w-full md:w-64">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent className="bg-slate-600 border-slate-500">
              <SelectItem value="all" className="text-white">Todas las categorías</SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white">
                  {cat.labelEs}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectValue placeholder="Tipo" />
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
                    setFormData({
                      ...formData,
                      category: value as ProductCategory,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.labelEs}
                      </SelectItem>
                    ))}
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
                    className="w-full max-w-sm h-auto object-cover rounded border border-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">Vista previa de la imagen</p>
                </div>
              )}

              {editing && (
                <ProductMediaGallery
                  productId={editing}
                  mediaList={mediaList}
                  onMediaAdded={(media) => setMediaList([...mediaList, media])}
                  onMediaRemoved={(path) =>
                    setMediaList(mediaList.filter((m) => m.path !== path))
                  }
                />
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
          <Card key={product.id} className="bg-slate-700 border-slate-600 overflow-hidden flex flex-col">
            {product.image && (
              <div className="w-full aspect-video bg-slate-600 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                  <div className="flex gap-1 justify-end mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-slate-600 text-slate-200 rounded">
                      {product.type}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded">
                      {PRODUCT_CATEGORIES.find(c => c.value === product.category)?.labelEs || product.category}
                    </span>
                  </div>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
          >
            Anterior
          </Button>
          <span className="text-white">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
