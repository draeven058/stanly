import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProductForm } from "@/components/dashboard/product-form";
import type { Profile, Product } from "@/types";

export const metadata: Metadata = { title: "Edit Product" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  if (!product) notFound();

  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardHeader
        title="Edit Product"
        description={product.title}
        profile={profile as Profile}
      />
      <ProductForm product={product as Product} />
    </div>
  );
}
