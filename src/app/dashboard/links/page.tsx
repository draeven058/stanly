import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { LinksManager } from "@/components/dashboard/links-manager";
import type { Profile, Link } from "@/types";

export const metadata: Metadata = { title: "Links" };

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardHeader
        title="Links"
        description="Add links to your store page."
        profile={profile as Profile}
      />
      <LinksManager links={(links ?? []) as Link[]} />
    </div>
  );
}
