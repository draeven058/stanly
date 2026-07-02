import type { StoreAppearance } from "@/types";

// Map typed tokens to CSS custom property names.
// Prefixed `--store-` to avoid colliding with the dashboard's
// own `--primary`, `--background`, etc. CSS variables.

const CONTAINER_WIDTH_MAP: Record<string, string> = {
  sm:  "640px",
  md:  "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl": "1536px",
};

const BUTTON_RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm:   "4px",
  md:   "8px",
  lg:   "12px",
  full: "9999px",
};

const BUTTON_SIZE_MAP: Record<string, { height: string; padding: string; fontSize: string }> = {
  sm: { height: "32px",  padding: "0 12px", fontSize: "12px" },
  md: { height: "40px",  padding: "0 16px", fontSize: "14px" },
  lg: { height: "48px",  padding: "0 24px", fontSize: "16px" },
};

const HEADING_SIZE_MAP: Record<string, string> = {
  xl:   "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
};

const BODY_SIZE_MAP: Record<string, string> = {
  xs:   "0.75rem",
  sm:   "0.875rem",
  base: "1rem",
};

// Generates a full CSS custom properties block for a store.
// Returns a string ready to be placed inside a <style> tag.
export function generateStoreCSSVars(appearance: StoreAppearance): string {
  const { colors, typography, spacing, buttons } = appearance;
  const btnSize = BUTTON_SIZE_MAP[buttons.size] ?? BUTTON_SIZE_MAP.md;

  // Button background/text depend on the style variant:
  // filled → accent bg, white text
  // outline → transparent bg, accent text, accent border
  // soft   → accent at 15% opacity bg, accent text
  const btnBg =
    buttons.style === "filled"
      ? colors.accent
      : buttons.style === "soft"
      ? `${colors.accent}26`
      : "transparent";

  const btnText =
    buttons.style === "filled" ? "#ffffff" : colors.accent;

  const btnBorder =
    buttons.style === "outline" ? colors.accent : "transparent";

  return `
    --store-accent: ${colors.accent};
    --store-background: ${colors.background};
    --store-surface: ${colors.surface};
    --store-text: ${colors.text};
    --store-text-muted: ${colors.textMuted};
    --store-border: ${colors.border};

    --store-font-family: "${typography.fontFamily}", system-ui, sans-serif;
    --store-heading-size: ${HEADING_SIZE_MAP[typography.headingSize] ?? "1.5rem"};
    --store-body-size: ${BODY_SIZE_MAP[typography.bodySize] ?? "0.875rem"};
    --store-font-weight: ${typography.fontWeight};

    --store-container-width: ${CONTAINER_WIDTH_MAP[spacing.containerWidth] ?? "1280px"};
    --store-section-gap: ${parseInt(spacing.sectionGap, 10) * 4}px;
    --store-card-padding: ${parseInt(spacing.cardPadding, 10) * 4}px;

    --store-btn-bg: ${btnBg};
    --store-btn-text: ${btnText};
    --store-btn-border: ${btnBorder};
    --store-btn-radius: ${BUTTON_RADIUS_MAP[buttons.radius] ?? "12px"};
    --store-btn-height: ${btnSize.height};
    --store-btn-padding: ${btnSize.padding};
    --store-btn-font-size: ${btnSize.fontSize};
  `.trim();
}

// Wraps the CSS vars in a :root selector block, ready to inject
// as a <style> tag on the public store page (server-rendered).
export function generateStoreCSSBlock(appearance: StoreAppearance): string {
  return `:root { ${generateStoreCSSVars(appearance)} }`;
}
