import type { StoreTemplateMeta } from "@/types";

// ============================================================
// Store template registry
//
// This is the single source of truth for "what templates exist."
// It is NOT a database table — template_id on the `stores` row
// just stores which entry here is selected. See:
//   supabase/migrations/0001_add_store_templates.sql
//
// Adding a new template later:
//   1. Add the id to the StoreTemplateId union in src/types/index.ts
//   2. Add the id to the store_template_id enum via a new migration
//   3. Add an entry here
//   4. Build the template component (Stage 3 — not yet built;
//      this registry currently describes templates whose visual
//      component doesn't exist on disk yet, see category note
//      on the Gallery page for how that's handled)
//
// Category is a *display grouping* for the gallery UI. It is
// deliberately separate from `tier` (free/premium) — category
// answers "what kind of store is this for," tier answers
// "who can use it." Conflating them would make a future 4th
// category awkward to add without touching billing logic.
// ============================================================

export type StoreTemplateCategory = "general" | "creative" | "education" | "ecommerce";

export interface StoreTemplateRegistryEntry extends StoreTemplateMeta {
  category: StoreTemplateCategory;
}

export const STORE_TEMPLATE_REGISTRY: StoreTemplateRegistryEntry[] = [
  {
    id: "minimal",
    label: "Minimal",
    description:
      "Clean, content-first layout with a centered profile and stacked product list. The current default — works for any niche.",
    tier: "free",
    category: "general",
    previewImageUrl: "/templates/minimal-preview.png",
  },
  {
    id: "bold",
    label: "Bold",
    description:
      "Large typography and a full-bleed banner image. Built for creators with a strong personal brand or a single flagship product.",
    tier: "free",
    category: "creative",
    previewImageUrl: "/templates/bold-preview.png",
  },
  {
    id: "gallery",
    label: "Gallery",
    description:
      "Grid-first layout that puts product thumbnails front and center. Best for visual goods — templates, presets, art, courses with cover art.",
    tier: "premium",
    category: "ecommerce",
    previewImageUrl: "/templates/gallery-preview.png",
  },
];

export function getTemplateById(id: string): StoreTemplateRegistryEntry | undefined {
  return STORE_TEMPLATE_REGISTRY.find((t) => t.id === id);
}
