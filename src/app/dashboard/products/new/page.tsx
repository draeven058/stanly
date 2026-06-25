import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProductForm } from "@/components/dashboard/product-form";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardHeader
        title="New Product"
        description="Create a new product to sell on your store."
        profile={profile as Profile}
      />
      <ProductForm />
    </div>
  );
}
