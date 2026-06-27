import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardHeader title="Settings" description="Manage your profile and store settings." profile={profile as Profile} />
      <ProfileForm profile={profile as Profile} />
    </div>
  );
}
