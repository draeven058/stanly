import { StoreProductCard } from "./store-product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface StoreProductsSectionProps {
  products: Product[];
  themeColor: string;
  layout?: "list" | "grid";
}

export function StoreProductsSection({
  products,
  themeColor,
  layout = "list",
}: StoreProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Products
      </h2>
      <div
        className={cn(
          layout === "grid"
            ? "grid grid-cols-2 gap-4 sm:grid-cols-3"
            : "space-y-4"
        )}
      >
        {products.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            themeColor={themeColor}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}
