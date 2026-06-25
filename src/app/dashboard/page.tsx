import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Eye,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Profile } from "@/types";
import { Metadata } from "next";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let stats = { total_revenue: 0, total_orders: 0, total_products: 0, total_views: 0 };
  let recentOrders: any[] = [];

  if (store) {
    const [ordersRes, productsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("amount, status, created_at, buyer_name, buyer_email, products(title)")
        .eq("products.store_id", store.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("id", { count: "exact" })
        .eq("store_id", store.id),
    ]);

    const completedOrders = (ordersRes.data ?? []).filter((o) => o.status === "completed");
    stats.total_revenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
    stats.total_orders = completedOrders.length;
    stats.total_products = productsRes.count ?? 0;
    recentOrders = (ordersRes.data ?? []).slice(0, 5);
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Good day, ${profile.full_name?.split(" ")[0] ?? profile.username} 👋`}
        description="Here's what's happening with your store."
        profile={profile as Profile}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          change={12}
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          label="Total Orders"
          value={formatNumber(stats.total_orders)}
          change={8}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Products"
          value={String(stats.total_products)}
          icon={<Package className="h-5 w-5" />}
          iconColor="bg-violet-500/10 text-violet-500"
        />
        <StatCard
          label="Page Views"
          value={formatNumber(stats.total_views)}
          change={-3}
          icon={<Eye className="h-5 w-5" />}
          iconColor="bg-orange-500/10 text-orange-500"
        />
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  );
}
