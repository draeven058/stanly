import type { Profile, Store, Product, Link as StoreLink, StoreAppearance } from "@/types";

export interface StoreTemplateProps {
  username: string;
  profile: Profile;
  store: Store | null;
  products: Product[];
  links: StoreLink[];
  // Fully-resolved appearance (defaults merged in by the page).
  // Templates must never read store.appearance directly — this
  // ensures they always get a complete config with no missing keys.
  appearance: StoreAppearance;
}
