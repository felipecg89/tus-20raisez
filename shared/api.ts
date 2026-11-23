/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Admin Panel Types
export type ProductCategory =
  | "compra"
  | "renta";

export type ProductType = 
  | "casa" 
  | "departamento" 
  | "terreno" 
  | "comercio" 
  | "salon_fiestas";

export const PRODUCT_TYPES: { value: ProductType; label: string; labelEs: string }[] = [
  { value: "casa", label: "House", labelEs: "Casa Residencial" },
  { value: "departamento", label: "Apartment", labelEs: "Departamento" },
  { value: "terreno", label: "Land", labelEs: "Terreno / Lote" },
  { value: "comercio", label: "Commercial", labelEs: "Comercio / Local / Bodega" },
  { value: "salon_fiestas", label: "Event Hall", labelEs: "Salón de Fiestas y Eventos" },
];

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string; labelEs: string }[] = [
  { value: "compra", label: "Purchase", labelEs: "Venta / Compra" },
  { value: "renta", label: "Rental", labelEs: "Renta / Alquiler" },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  city: string;
  state?: string;
  postalCode?: string;
  neighborhood?: string;
  address?: string;
  streetType?: "calle" | "privada" | "avenida" | "carretera" | "otro";
  streetName?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  type: ProductType;
  category: ProductCategory;
  isCommercial?: boolean;
  capacity?: number; // Para salones de fiestas (aforo de personas) o locales
  rentalPeriod?: "evento" | "dia" | "mensual" | "anual"; // Para rentas temporales o comerciales
  image: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floors?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  city: string;
  message?: string;
  createdAt: string;
  read: boolean;
}

export interface ContentBlock {
  id: string;
  section: string;
  key: string;
  value: any;
  updatedAt: string;
}

export interface LegalArticle {
  id: string;
  title: string;
  category: "ley" | "imss" | "infonavit" | "notarial" | "general";
  summary: string;
  content: string;
  importantNotice?: string;
  published: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalMessages: number;
  unreadMessages: number;
  lastUpdated: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
