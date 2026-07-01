import type { Profile, Store, Product, Link as StoreLink } from "@/types";

// ============================================================
// StoreTemplateProps
//
// Every template component (MinimalTemplate, BoldTemplate,
// GalleryTemplate, and any future one) receives exactly this
// shape and nothing else. This is what makes templates swappable:
// the data-fetching logic in app/store/[username]/page.tsx is
// written once, and no template is ever allowed to reach into
// Supabase on its own.
//
// `username` is passed separately from `profile` even though
// profile already has it — this is intentional. It's the URL
// param as received by the page, used for things like the AI
// chat widget's API calls and constructing share URLs. Profile's
// username is the source of truth for *display*; this is the
// source of truth for *routing*. In practice they're always the
// same string, but keeping them conceptually separate means a
// template never has to guess which one a given UI element should
// reference.
// ============================================================
export interface StoreTemplateProps {
  username: string;
  profile: Profile;
  store: Store | null;
  products: Product[];
  links: StoreLink[];
}
