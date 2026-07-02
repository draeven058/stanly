import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function BoldTemplate({ username, profile, store, products, links, appearance }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";

  return (
    <div className="min-h-svh" style={{ backgroundColor: "var(--store-background)" }}>
      <div
        className="h-64 sm:h-80"
        style={{ background: `linear-gradient(160deg, ${themeColor}90, ${themeColor}30, transparent)` }}
      />
      <div
        className="mx-auto px-4 pb-28"
        style={{ maxWidth: "var(--store-container-width, 768px)" }}
      >
        <div className="-mt-20 sm:-mt-24">
          <StoreProfileHeader
            profile={profile}
            username={username}
            themeColor={themeColor}
            variant="hero"
            showBio={appearance.sections.showBio}
            showSocials={appearance.sections.showSocials}
          />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          {appearance.sections.showLinks && (
            <div className="space-y-3">
              <StoreLinksList links={links} />
            </div>
          )}
          {appearance.sections.showProducts && (
            <div>
              <StoreProductsSection products={products} layout="list" />
            </div>
          )}
        </div>
        {appearance.sections.showFooter && <StoreFooter />}
      </div>
    </div>
  );
}
