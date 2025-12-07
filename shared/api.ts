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
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  city: string;
  type: "casa" | "terreno";
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
