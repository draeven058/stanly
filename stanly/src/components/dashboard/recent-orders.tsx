import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  amount: number;
  status: string;
  created_at: string;
  buyer_name: string | null;
  buyer_email: string;
  products?: { title: string } | null;
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Share your store link to start selling.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{order.buyer_name ?? order.buyer_email}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.products?.title ?? "Product"} · {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "success"
                        : order.status === "refunded"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {order.status}
                  </Badge>
                  <span className="text-sm font-semibold">{formatCurrency(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
