import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function GalleryTemplate({ username, profile, store, products, links }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";

  return (
    <div className="min-h-svh bg-background">
      {/* Subtle top bar in theme color — gallery is product-forward
          so the header stripe is intentionally restrained compared
          to Bold, keeping visual focus on the product grid below. */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: themeColor }}
      />

      <div className="mx-auto max-w-5xl px-4 pb-28 pt-10">
        {/* Profile sits compact at the top — gallery template's
            hierarchy is: brand identity first, then products fill
            the remaining 80% of the page. */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 mb-10">
          <div className="shrink-0">
            <StoreProfileHeader
              profile={profile}
              username={username}
              themeColor={themeColor}
              variant="centered"
            />
          </div>

          {links.length > 0 && (
            <div className="mt-6 sm:mt-0 w-full max-w-xs">
              <StoreLinksList links={links} />
            </div>
          )}
        </div>

        {/* Product grid — this is the defining feature of this
            template. Full-width, 2 cols on mobile, 3 on desktop. */}
        <StoreProductsSection
          products={products}
          themeColor={themeColor}
          layout="grid"
        />

        <StoreFooter />
      </div>
    </div>
  );
}
