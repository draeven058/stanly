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

// Mirrors the Postgres enum `store_template_id` in
// supabase/migrations/0001_add_store_templates.sql.
// If a new template is added to the database enum, add it here
// in the same migration/commit so the two never drift apart.
export type StoreTemplateId = "minimal" | "bold" | "gallery";

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string;
  template_id: StoreTemplateId;
  appearance: PartialStoreAppearance;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Pricing tier a template is gated behind. Lives alongside the
// Store types (not in lib/templates/) because it's part of the
// public data contract — the dashboard, the picker UI, and any
// future billing code all need to agree on what "tier" means.
export type TemplateTier = "free" | "premium";

// Static metadata describing one entry in the template registry.
// This is NOT a database row — there is no `templates` table.
// The registry lives in code (lib/templates/store/registry.ts)
// and this type just gives that registry a shape. See the
// architecture note in that file for why tier-gating is
// code-level rather than a DB column.
export interface StoreTemplateMeta {
  id: StoreTemplateId;
  label: string;
  description: string;
  tier: TemplateTier;
  previewImageUrl: string;
}

// ============================================================
// Store Appearance — mirrors the JSONB schema in
// supabase/migrations/0002_add_store_appearance.sql.
//
// All keys are optional at the type level (Partial<>) because
// the store page merges saved config with defaults — a missing
// key in the DB row (e.g. from a store created before a new
// token was added) falls back to the default rather than
// crashing. The editor always writes a complete config, but
// reads must tolerate partial data.
// ============================================================

export type AppearanceFontFamily =
  | "Inter"
  | "Lora"
  | "DM Mono"
  | "Cal Sans"
  | "Playfair Display";

export type AppearanceHeadingSize = "xl" | "2xl" | "3xl" | "4xl";
export type AppearanceBodySize = "xs" | "sm" | "base";
export type AppearanceFontWeight = "normal" | "medium" | "semibold" | "bold";
export type AppearanceContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl";
export type AppearanceButtonRadius = "none" | "sm" | "md" | "lg" | "full";
export type AppearanceButtonStyle = "filled" | "outline" | "soft";
export type AppearanceButtonSize = "sm" | "md" | "lg";

export interface StoreAppearanceColors {
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface StoreAppearanceTypography {
  fontFamily: AppearanceFontFamily;
  headingSize: AppearanceHeadingSize;
  bodySize: AppearanceBodySize;
  fontWeight: AppearanceFontWeight;
}

export interface StoreAppearanceSpacing {
  containerWidth: AppearanceContainerWidth;
  sectionGap: string;
  cardPadding: string;
}

export interface StoreAppearanceButtons {
  radius: AppearanceButtonRadius;
  style: AppearanceButtonStyle;
  size: AppearanceButtonSize;
}

export interface StoreAppearanceSections {
  showBio: boolean;
  showLinks: boolean;
  showProducts: boolean;
  showSocials: boolean;
  showFooter: boolean;
}

export interface StoreAppearance {
  colors: StoreAppearanceColors;
  typography: StoreAppearanceTypography;
  spacing: StoreAppearanceSpacing;
  buttons: StoreAppearanceButtons;
  sections: StoreAppearanceSections;
}

export type PartialStoreAppearance = {
  colors?: Partial<StoreAppearanceColors>;
  typography?: Partial<StoreAppearanceTypography>;
  spacing?: Partial<StoreAppearanceSpacing>;
  buttons?: Partial<StoreAppearanceButtons>;
  sections?: Partial<StoreAppearanceSections>;
};

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
