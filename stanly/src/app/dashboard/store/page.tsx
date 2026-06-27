import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { StoreSettings } from "@/components/dashboard/store-settings";
import type { Profile, Store } from "@/types";

export const metadata: Metadata = { title: "Store" };

export default async function StorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardHeader
        title="Store"
        description="Manage your public store page."
        profile={profile as Profile}
      />
      <StoreSettings profile={profile as Profile} store={store as Store | null} />
    </div>
  );
}
