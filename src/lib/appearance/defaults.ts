import type {
  StoreAppearance,
  PartialStoreAppearance,
} from "@/types";

// ============================================================
// Default appearance config
//
// Matches the JSONB DEFAULT in migration 0002 exactly.
// Any store without a saved appearance (or with a partial one
// from before a new token was introduced) merges with this.
// ============================================================
export const DEFAULT_APPEARANCE: StoreAppearance = {
  colors: {
    accent:     "#7c3aed",
    background: "#0f0f0f",
    surface:    "#1a1a1a",
    text:       "#f5f5f5",
    textMuted:  "#a1a1aa",
    border:     "#27272a",
  },
  typography: {
    fontFamily:  "Inter",
    headingSize: "2xl",
    bodySize:    "sm",
    fontWeight:  "semibold",
  },
  spacing: {
    containerWidth: "xl",
    sectionGap:     "10",
    cardPadding:    "5",
  },
  buttons: {
    radius: "lg",
    style:  "filled",
    size:   "md",
  },
  sections: {
    showBio:      true,
    showLinks:    true,
    showProducts: true,
    showSocials:  true,
    showFooter:   true,
  },
};

// Deep-merge a partial appearance over the defaults.
// Works one level deep which is sufficient for this schema.
export function mergeAppearance(
  partial: PartialStoreAppearance | null | undefined
): StoreAppearance {
  if (!partial) return DEFAULT_APPEARANCE;
  return {
    colors:     { ...DEFAULT_APPEARANCE.colors,     ...(partial.colors     ?? {}) },
    typography: { ...DEFAULT_APPEARANCE.typography, ...(partial.typography ?? {}) },
    spacing:    { ...DEFAULT_APPEARANCE.spacing,    ...(partial.spacing    ?? {}) },
    buttons:    { ...DEFAULT_APPEARANCE.buttons,    ...(partial.buttons    ?? {}) },
    sections:   { ...DEFAULT_APPEARANCE.sections,   ...(partial.sections   ?? {}) },
  };
}
