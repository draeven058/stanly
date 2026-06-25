export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductType = "digital" | "course" | "membership" | "link";

export interface Product {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  price: number;
  type: ProductType;
  file_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  slug: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "completed" | "refunded" | "failed";

export interface Order {
  id: string;
  product_id: string;
  buyer_email: string;
  buyer_name: string | null;
  amount: number;
  status: OrderStatus;
  stripe_session_id: string | null;
  created_at: string;
  product?: Product;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsData {
  date: string;
  views: number;
  orders: number;
  revenue: number;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_views: number;
  revenue_change: number;
  orders_change: number;
}
