import { Product, PRODUCT_CATEGORIES } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ProductTableViewProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
}

export default function ProductTableView({
  products,
  onViewProduct,
}: ProductTableViewProps) {
  const getCategoryLabel = (category: string) => {
    return PRODUCT_CATEGORIES.find((c) => c.value === category)?.labelEs || category;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No hay productos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-800">
            <th className="px-4 py-3 text-left text-slate-300 font-semibold">Nombre</th>
            <th className="px-4 py-3 text-left text-slate-300 font-semibold">Ciudad</th>
            <th className="px-4 py-3 text-left text-slate-300 font-semibold">Precio</th>
            <th className="px-4 py-3 text-left text-slate-300 font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-slate-300 font-semibold">Categoría</th>
            <th className="px-4 py-3 text-center text-slate-300 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-4 py-3 text-slate-200 font-medium">
                {product.name}
              </td>
              <td className="px-4 py-3 text-slate-300">{product.city}</td>
              <td className="px-4 py-3 text-emerald-400 font-semibold">
                ${product.price.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-300 capitalize">{product.type}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded">
                  {getCategoryLabel(product.category)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <Button
                  size="sm"
                  onClick={() => onViewProduct(product)}
                  className="bg-slate-600 hover:bg-slate-500 inline-flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
