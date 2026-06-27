import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { AIAnalyticsInsights } from "@/components/ai/ai-analytics-insights";
import { DollarSign, ShoppingBag, Eye, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Analytics" };

function generateMockData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 200) + 20,
      orders: Math.floor(Math.random() * 10),
      revenue: Math.floor(Math.random() * 50000) + 1000,
    });
  }
  return data;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: store } = await supabase.from("stores").select("id").eq("user_id", user.id).single();

  let products: any[] = [];
  let recentOrders: any[] = [];

  if (store) {
    const [prodRes, ordersRes] = await Promise.all([
      supabase.from("products").select("title, price, type").eq("store_id", store.id),
      supabase.from("orders").select("amount, status, created_at").limit(20),
    ]);
    products = prodRes.data ?? [];
    recentOrders = ordersRes.data ?? [];
  }

  const analyticsData = generateMockData();
  const totals = analyticsData.reduce(
    (acc, d) => ({ views: acc.views + d.views, orders: acc.orders + d.orders, revenue: acc.revenue + d.revenue }),
    { views: 0, orders: 0, revenue: 0 }
  );

  const stats = {
    total_revenue: totals.revenue,
    total_orders: totals.orders,
    total_products: products.length,
    total_views: totals.views,
  };

  return (
    <div className="space-y-8">
      <DashboardHeader title="Analytics" description="Last 30 days" profile={profile as Profile} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue"  value={formatCurrency(totals.revenue)} change={12}  icon={<DollarSign className="h-5 w-5" />} iconColor="bg-emerald-500/10 text-emerald-500" />
        <StatCard label="Orders"         value={formatNumber(totals.orders)}   change={8}   icon={<ShoppingBag className="h-5 w-5" />} iconColor="bg-blue-500/10 text-blue-500" />
        <StatCard label="Page Views"     value={formatNumber(totals.views)}    change={15}  icon={<Eye className="h-5 w-5" />}         iconColor="bg-orange-500/10 text-orange-500" />
        <StatCard label="Conversion"     value={`${((totals.orders / totals.views) * 100).toFixed(1)}%`} change={2} icon={<TrendingUp className="h-5 w-5" />} iconColor="bg-violet-500/10 text-violet-500" />
      </div>

      {/* ✨ AI Insights — sits above charts */}
      <AIAnalyticsInsights
        stats={stats}
        products={products}
        recentOrders={recentOrders}
      />

      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}
