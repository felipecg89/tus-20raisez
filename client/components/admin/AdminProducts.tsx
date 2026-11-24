import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, PRODUCT_CATEGORIES, ProductCategory, ProductType, PRODUCT_TYPES } from "@shared/api";
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
import { supabase } from "@/lib/supabase";
import { PRIVATE_ROUTES } from "@/lib/routes";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductTableView from "./ProductTableView";

interface AdminProductsProps {
  onUpdate: () => void;
}

export default function AdminProducts({ onUpdate }: AdminProductsProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    type: "casa" as ProductType,
    category: "compra" as ProductCategory,
    isCommercial: false,
    capacity: "",
    rentalPeriod: "mensual" as "evento" | "dia" | "mensual" | "anual",
    image: "",
    features: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    floors: "",
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
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.data) {
          setProducts(result.data);
          setTotalPages(result.pagination.totalPages);
        } else {
          setProducts(Array.isArray(result) ? result : []);
        }
      } else {
        // Fallback a consulta directa de Supabase
        let query = supabase.from("products").select("*");
        if (categoryFilter) query = query.eq("category", categoryFilter);
        const { data: supaProducts } = await query;
        if (supaProducts) {
          setProducts(
            supaProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              city: p.city,
              state: p.state,
              type: p.type,
              category: p.category,
              isCommercial: p.is_commercial,
              capacity: p.capacity,
              rentalPeriod: p.rental_period,
              image: p.main_image_url || p.image,
              features: p.features || [],
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              area: p.area,
              floors: p.floors,
              createdAt: p.created_at || new Date().toISOString(),
              updatedAt: p.updated_at || new Date().toISOString(),
            }))
          );
        }
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
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        rentalPeriod: formData.rentalPeriod,
        bedrooms: (formData.type === "casa" || formData.type === "departamento") && formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: (formData.type === "casa" || formData.type === "departamento" || formData.type === "comercio" || formData.type === "salon_fiestas") && formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseInt(formData.area) : 0,
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
        category: "compra",
        isCommercial: false,
        capacity: "",
        rentalPeriod: "mensual",
        image: "",
        features: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        floors: "",
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
      isCommercial: (product as any).isCommercial || false,
      capacity: (product as any).capacity ? (product as any).capacity.toString() : "",
      rentalPeriod: (product as any).rentalPeriod || "mensual",
      image: product.image,
      features: product.features.join(", "),
      bedrooms: (product as any).bedrooms ? (product as any).bedrooms.toString() : "",
      bathrooms: (product as any).bathrooms ? (product as any).bathrooms.toString() : "",
      area: (product as any).area ? (product as any).area.toString() : "",
      floors: (product as any).floors ? (product as any).floors.toString() : "",
    });
    setImagePreview(product.image);
    setEditing(product.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      city: "",
      type: "casa",
      category: "compra",
      isCommercial: false,
      capacity: "",
      rentalPeriod: "mensual",
      image: "",
      features: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      floors: "",
    });
    setEditing(null);
    setImagePreview("");
    setShowForm(false);
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


  const handleViewProduct = (product: Product) => {
    navigate(PRIVATE_ROUTES.adminProductDetail(product.id));
  };

  if (loading) {
    return <div className="text-slate-400">Cargando productos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
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
              navigate(PRIVATE_ROUTES.adminProductDetail("new"));
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

      {/* Form removed - use /admin/productos/new to create or /admin/productos/:id to edit */}
      {false && (
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
                      type: value as ProductType,
                      isCommercial: value === "comercio" || value === "salon_fiestas" || formData.isCommercial,
                      category: value === "salon_fiestas" ? "renta" : formData.category,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Tipo de Inmueble" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    {PRODUCT_TYPES.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value} className="text-white">
                        {pt.labelEs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(formData.type === "salon_fiestas" || formData.type === "comercio") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-full bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div>
                      <label className="text-xs font-semibold text-emerald-400 mb-1 block">
                        Capacidad / Aforo de Personas (Salón o Local)
                      </label>
                      <Input
                        type="number"
                        placeholder="Ej. 250 personas"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-emerald-400 mb-1 block">
                        Modalidad de Renta
                      </label>
                      <Select
                        value={formData.rentalPeriod}
                        onValueChange={(val) =>
                          setFormData({ ...formData, rentalPeriod: val as any })
                        }
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                          <SelectValue placeholder="Periodo de renta" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-600 border-slate-500">
                          <SelectItem value="evento" className="text-white">Por Evento (Salón / Fiesta)</SelectItem>
                          <SelectItem value="dia" className="text-white">Por Día</SelectItem>
                          <SelectItem value="mensual" className="text-white">Mensual (Contrato)</SelectItem>
                          <SelectItem value="anual" className="text-white">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

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

                <Select
                  value={formData.isCommercial ? "commercial" : "residential"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      isCommercial: value === "commercial",
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Tipo de Propiedad" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-600 border-slate-500">
                    <SelectItem value="residential" className="text-white">
                      No Comercial
                    </SelectItem>
                    <SelectItem value="commercial" className="text-white">
                      Comercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specification fields - always visible */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Recámaras"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <Input
                  placeholder="Baños"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bathrooms: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <Input
                  placeholder="Metros cuadrados"
                  type="number"
                  min="0"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <Input
                  placeholder="Número de pisos"
                  type="number"
                  min="0"
                  value={formData.floors}
                  onChange={(e) =>
                    setFormData({ ...formData, floors: e.target.value })
                  }
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full max-w-sm h-auto object-contain rounded border border-slate-500"
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

      {/* Products List - Table View */}
      {viewMode === "table" ? (
        <div className="bg-slate-700 rounded-lg border border-slate-600">
          <ProductTableView
            products={products}
            onViewProduct={handleViewProduct}
          />
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-slate-700 border-slate-600 overflow-hidden flex flex-col cursor-pointer hover:border-slate-500 transition-colors"
              onClick={() => handleViewProduct(product)}
            >
              {product.image && (
                <div className="w-full aspect-video bg-slate-600 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-xl text-white leading-snug">
                      {product.name}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">{product.city}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-base sm:text-lg font-bold text-emerald-400">
                      ${product.price.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:justify-end mt-1">
                      <span className="inline-block px-2 py-0.5 text-xs bg-slate-600 text-slate-200 rounded">
                        {product.type}
                      </span>
                      <span className="inline-block px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
