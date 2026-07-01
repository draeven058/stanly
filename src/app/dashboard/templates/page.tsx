import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import type { Profile, Store } from "@/types";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    <div className="space-y-8">
      <DashboardHeader
        title="Templates"
        description="Choose how your public store page looks."
        profile={profile as Profile}
      />
      <TemplateGallery currentTemplateId={(store as Store | null)?.template_id ?? "minimal"} />
    </div>
  );
}
