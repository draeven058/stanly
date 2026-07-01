import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateRenderer } from "@/components/store-templates/template-renderer";
import type { Profile, Store, Product, Link as StoreLink, StoreTemplateId } from "@/types";

interface StorePageProps {
  params: Promise<{ username: string }>;
}

// generateMetadata is preserved exactly from the original —
// same lightweight select, same return shape, no changes.
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Store not found" };

  return {
    title: profile.full_name ?? username,
    description: profile.bio ?? `Check out ${profile.full_name ?? username}'s store on Stanly.`,
    openGraph: { images: profile.avatar_url ? [profile.avatar_url] : [] },
  };
}

// The page is now a thin data-fetching shell — all rendering is
// delegated to TemplateRenderer, which picks the right template
// based on store.template_id. This file's only responsibilities:
//   1. Fetch all required data once
//   2. Call notFound() if the profile doesn't exist
//   3. Pass everything to TemplateRenderer as typed props
//
// Adding a new template in future requires zero changes here.
export default async function StorePage({ params }: StorePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", profile.id)
    .single();

  let products: Product[] = [];
  let links: StoreLink[] = [];

  if (store) {
    const [productsRes, linksRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("store_id", store.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("links")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("is_active", true)
        .order("sort_order"),
    ]);
    products = (productsRes.data ?? []) as Product[];
    links = (linksRes.data ?? []) as StoreLink[];
  }

  // Default to "minimal" if store doesn't exist yet — the store
  // row is created lazily on first product creation via
  // getOrCreateStore(), so a brand new user visiting their store
  // URL before creating any products won't have a store row yet.
  const templateId: StoreTemplateId =
    (store as Store | null)?.template_id ?? "minimal";

  return (
    <TemplateRenderer
      templateId={templateId}
      username={username}
      profile={profile as Profile}
      store={store as Store | null}
      products={products}
      links={links}
    />
  );
}
