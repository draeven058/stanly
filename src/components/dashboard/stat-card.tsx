import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconColor?: string;
}

export function StatCard({ label, value, change, icon, iconColor }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-emerald-500" : "text-red-500"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change)}% vs last month
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-2.5", iconColor ?? "bg-primary/10 text-primary")}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
