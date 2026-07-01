import { StoreProfileHeader } from "../sections/store-profile-header";
import { StoreLinksList } from "../sections/store-links-list";
import { StoreProductsSection } from "../sections/store-products-section";
import { StoreFooter } from "../sections/store-footer";
import type { StoreTemplateProps } from "@/lib/templates/store/types";

export function MinimalTemplate({ username, profile, store, products, links }: StoreTemplateProps) {
  const themeColor = store?.theme_color ?? "#7c3aed";

  return (
    <div className="min-h-svh bg-background">
      <div
        className="h-36"
        style={{
          background: `linear-gradient(135deg, ${themeColor}40, ${themeColor}10, transparent)`,
        }}
      />

      <div className="mx-auto max-w-xl px-4 pb-28">
        <div className="-mt-16">
          <StoreProfileHeader
            profile={profile}
            username={username}
            themeColor={themeColor}
            variant="centered"
          />
        </div>

        <div className="mt-8">
          <StoreLinksList links={links} />
        </div>

        <div className="mt-10">
          <StoreProductsSection products={products} themeColor={themeColor} layout="list" />
        </div>

        <StoreFooter />
      </div>
    </div>
  );
}
