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
  | "venta_casa"
  | "venta_terreno"
  | "renta_casa"
  | "renta_terreno";

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string; labelEs: string }[] = [
  { value: "venta_casa", label: "House Sale", labelEs: "Venta de Casa" },
  { value: "venta_terreno", label: "Land Sale", labelEs: "Venta de Terreno" },
  { value: "renta_casa", label: "House Rental", labelEs: "Renta de Casa" },
  { value: "renta_terreno", label: "Land Rental", labelEs: "Renta de Terreno" },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  city: string;
  state?: string;
  address?: string;
  streetType?: "calle" | "privada" | "avenida" | "carretera" | "otro";
  streetName?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  type: "casa" | "terreno";
  category: ProductCategory;
  image: string;
  features: string[];
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
