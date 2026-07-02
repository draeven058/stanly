import { StoreProductCard } from "./store-product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface StoreProductsSectionProps {
  products: Product[];
  layout?: "list" | "grid";
}

// themeColor removed — propagated to StoreProductCard via
// CSS variables, no longer needed as a prop here.
export function StoreProductsSection({
  products,
  layout = "list",
}: StoreProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2
        className="mb-4 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--store-text-muted)" }}
      >
        Products
      </h2>
      <div
        className={cn(
          layout === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3" : "space-y-4"
        )}
      >
        {products.map((product) => (
          <StoreProductCard key={product.id} product={product} layout={layout} />
        ))}
      </div>
    </div>
  );
}
