import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function GalleryTemplate({ username, profile, store, products, links, appearance }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";

  return (
    <div className="min-h-svh" style={{ backgroundColor: "var(--store-background)" }}>
      <div className="h-2 w-full" style={{ backgroundColor: themeColor }} />
      <div
        className="mx-auto px-4 pb-28 pt-10"
        style={{ maxWidth: "var(--store-container-width, 1280px)" }}
      >
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 mb-10">
          <div className="shrink-0">
            <StoreProfileHeader
              profile={profile}
              username={username}
              themeColor={themeColor}
              variant="centered"
              showBio={appearance.sections.showBio}
              showSocials={appearance.sections.showSocials}
            />
          </div>
          {appearance.sections.showLinks && links.length > 0 && (
            <div className="mt-6 sm:mt-0 w-full max-w-xs">
              <StoreLinksList links={links} />
            </div>
          )}
        </div>
        {appearance.sections.showProducts && (
          <StoreProductsSection products={products} layout="grid" />
        )}
        {appearance.sections.showFooter && <StoreFooter />}
      </div>
    </div>
  );
}
