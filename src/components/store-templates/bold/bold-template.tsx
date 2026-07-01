import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function BoldTemplate({ username, profile, store, products, links }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";

  return (
    <div className="min-h-svh bg-background">
      {/* Full-bleed banner — taller and more saturated than
          Minimal's gradient strip, since this template's whole
          premise is a stronger visual first impression. */}
      <div
        className="h-64 sm:h-80"
        style={{
          background: `linear-gradient(160deg, ${themeColor}90, ${themeColor}30, transparent)`,
        }}
      />

      <div className="mx-auto max-w-3xl px-4 pb-28">
        <div className="-mt-20 sm:-mt-24">
          <StoreProfileHeader
            profile={profile}
            username={username}
            themeColor={themeColor}
            variant="hero"
          />
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-[1fr] lg:grid-cols-2 lg:items-start">
          <div className="space-y-3">
            <StoreLinksList links={links} />
          </div>

          <div>
            <StoreProductsSection products={products} themeColor={themeColor} layout="list" />
          </div>
        </div>

        <StoreFooter />
      </div>
    </div>
  );
}
