import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function MinimalTemplate({ username, profile, store, products, links, appearance }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";
  const showLinks    = appearance.sections.showLinks;
  const showProducts = appearance.sections.showProducts;

  return (
    <div className="min-h-svh" style={{ backgroundColor: "var(--store-background)" }}>
      <div
        className="h-36"
        style={{ background: `linear-gradient(135deg, ${themeColor}40, ${themeColor}10, transparent)` }}
      />
      <div
        className="mx-auto px-4 pb-28"
        style={{ maxWidth: "var(--store-container-width, 640px)" }}
      >
        <div className="-mt-16">
          <StoreProfileHeader
            profile={profile}
            username={username}
            themeColor={themeColor}
            variant="centered"
            showBio={appearance.sections.showBio}
            showSocials={appearance.sections.showSocials}
          />
        </div>
        {showLinks && (
          <div style={{ marginTop: "var(--store-section-gap)" }}>
            <StoreLinksList links={links} />
          </div>
        )}
        {showProducts && (
          <div style={{ marginTop: "var(--store-section-gap)" }}>
            <StoreProductsSection products={products} layout="list" />
          </div>
        )}
        {appearance.sections.showFooter && <StoreFooter />}
      </div>
    </div>
  );
}
