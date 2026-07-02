import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateRenderer } from "@/components/store-templates/template-renderer";
import { mergeAppearance } from "@/lib/appearance/defaults";
import { generateStoreCSSVars } from "@/lib/appearance/css-vars";
import type { Profile, Store, Product, Link as StoreLink, StoreTemplateId } from "@/types";

interface StorePageProps {
  params: Promise<{ username: string }>;
}

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
    links    = (linksRes.data ?? []) as StoreLink[];
  }

  const templateId: StoreTemplateId =
    (store as Store | null)?.template_id ?? "minimal";

  // Merge saved appearance with defaults so every token always
  // has a value — templates never see undefined CSS variables.
  const appearance = mergeAppearance(
    (store as Store | null)?.appearance ?? null
  );

  const cssVars = generateStoreCSSVars(appearance);

  return (
    <TemplateRenderer
      templateId={templateId}
      username={username}
      profile={profile as Profile}
      store={store as Store | null}
      products={products}
      links={links}
      appearance={appearance}
      cssVars={cssVars}
    />
  );
}
