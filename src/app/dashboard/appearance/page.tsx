import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/header";
import { AppearanceEditor } from "@/components/dashboard/appearance/appearance-editor";
import { mergeAppearance } from "@/lib/appearance/defaults";
import type { Profile, Store, Product, Link as StoreLink } from "@/types";

export const metadata: Metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: store } = await supabase
    .from("stores").select("*").eq("user_id", user.id).single();

  // Fetch sample data for the live preview
  let products: Product[] = [];
  let links: StoreLink[] = [];

  if (store) {
    const [productsRes, linksRes] = await Promise.all([
      supabase
        .from("products").select("*")
        .eq("store_id", store.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("links").select("*")
        .eq("profile_id", user.id)
        .eq("is_active", true)
        .order("sort_order")
        .limit(4),
    ]);
    products = (productsRes.data ?? []) as Product[];
    links    = (linksRes.data ?? []) as StoreLink[];
  }

  const savedAppearance = mergeAppearance(
    (store as Store | null)?.appearance ?? null
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Appearance"
        description="Customise how your store looks. Changes preview instantly."
        profile={profile as Profile}
      />
      <AppearanceEditor
        initialAppearance={savedAppearance}
        profile={profile as Profile}
        store={store as Store | null}
        products={products}
        links={links}
      />
    </div>
  );
}
