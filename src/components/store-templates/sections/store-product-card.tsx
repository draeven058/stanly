import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Package } from "lucide-react";
import type { Product } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  digital: "Digital",
  course: "Course",
  membership: "Membership",
  link: "Link",
};

interface StoreProductCardProps {
  product: Product;
  themeColor: string;
  // "list" shows description + full-width buy button (Minimal,
  // Bold). "grid" is more compact — thumbnail-forward, used inside
  // a multi-column grid where space is tighter (Gallery).
  layout?: "list" | "grid";
}

export function StoreProductCard({
  product,
  themeColor,
  layout = "list",
}: StoreProductCardProps) {
  const isGrid = layout === "grid";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {product.thumbnail_url ? (
          <Image src={product.thumbnail_url} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className={isGrid ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={isGrid ? "font-semibold text-sm truncate" : "font-semibold"}>
              {product.title}
            </h3>
            {!isGrid && product.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
            <Badge variant="secondary" className="mt-2 text-xs">
              {TYPE_LABELS[product.type]}
            </Badge>
          </div>
          {!isGrid && (
            <p className="text-xl font-bold shrink-0" style={{ color: themeColor }}>
              {formatCurrency(product.price)}
            </p>
          )}
        </div>

        {isGrid && (
          <p className="mt-2 text-base font-bold" style={{ color: themeColor }}>
            {formatCurrency(product.price)}
          </p>
        )}

        <button
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: themeColor }}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy now
        </button>
      </div>
    </div>
  );
}
