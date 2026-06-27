import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Package } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/dashboard/product-card";
import type { Profile, Product } from "@/types";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: store } = await supabase.from("stores").select("id").eq("user_id", user.id).single();

  let products: Product[] = [];
  if (store) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    products = (data ?? []) as Product[];
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Products"
        description={`${products.length} product${products.length !== 1 ? "s" : ""}`}
        profile={profile as Profile}
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              New product
            </Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <div className="rounded-xl bg-primary/10 p-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first product to start selling.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              Create product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
