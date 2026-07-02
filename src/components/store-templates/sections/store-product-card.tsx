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
  layout?: "list" | "grid";
}

// themeColor prop removed — buttons and prices now read
// --store-accent / --store-btn-* CSS variables so the appearance
// editor's live preview works without prop-drilling.
export function StoreProductCard({
  product,
  layout = "list",
}: StoreProductCardProps) {
  const isGrid = layout === "grid";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--store-surface)",
        border: "1px solid var(--store-border)",
      }}
    >
      <div className="relative aspect-video bg-muted">
        {product.thumbnail_url ? (
          <Image src={product.thumbnail_url} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div style={{ padding: `var(--store-card-padding)` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className={isGrid ? "truncate" : ""}
              style={{
                fontFamily: "var(--store-font-family)",
                fontWeight: "var(--store-font-weight)",
                fontSize: isGrid ? "var(--store-body-size)" : "1rem",
                color: "var(--store-text)",
              }}
            >
              {product.title}
            </h3>
            {!isGrid && product.description && (
              <p
                className="mt-1 line-clamp-2"
                style={{
                  fontSize: "var(--store-body-size)",
                  color: "var(--store-text-muted)",
                }}
              >
                {product.description}
              </p>
            )}
            <Badge variant="secondary" className="mt-2 text-xs">
              {TYPE_LABELS[product.type]}
            </Badge>
          </div>
          {!isGrid && (
            <p
              className="text-xl shrink-0"
              style={{
                fontWeight: "var(--store-font-weight)",
                color: "var(--store-accent)",
              }}
            >
              {formatCurrency(product.price)}
            </p>
          )}
        </div>

        {isGrid && (
          <p
            className="mt-2 text-base"
            style={{
              fontWeight: "var(--store-font-weight)",
              color: "var(--store-accent)",
            }}
          >
            {formatCurrency(product.price)}
          </p>
        )}

        {/* Buy button reads all --store-btn-* variables */}
        <button
          className="mt-3 w-full flex items-center justify-center gap-2 font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--store-btn-bg)",
            color: "var(--store-btn-text)",
            border: "1px solid var(--store-btn-border)",
            borderRadius: "var(--store-btn-radius)",
            height: "var(--store-btn-height)",
            padding: "var(--store-btn-padding)",
            fontSize: "var(--store-btn-font-size)",
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy now
        </button>
      </div>
    </div>
  );
}
