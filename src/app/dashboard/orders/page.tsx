import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Profile } from "@/types";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: store } = await supabase.from("stores").select("id").eq("user_id", user.id).single();

  let orders: any[] = [];
  if (store) {
    const { data: products } = await supabase.from("products").select("id").eq("store_id", store.id);
    const productIds = (products ?? []).map((p) => p.id);
    if (productIds.length > 0) {
      const { data } = await supabase
        .from("orders")
        .select("*, product:products(title)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });
      orders = data ?? [];
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Orders" description={`${orders.length} total orders`} profile={profile as Profile} />
      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground hidden md:table-cell">Product</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="px-6 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3.5 text-right font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.buyer_name ?? "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{order.buyer_email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                      {order.product?.title ?? "—"}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        order.status === "completed" ? "success" :
                        order.status === "refunded" ? "destructive" : "warning"
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {formatCurrency(order.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
