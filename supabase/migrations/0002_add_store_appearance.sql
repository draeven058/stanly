-- ============================================================
-- Migration: add appearance configuration to stores
-- ============================================================
--
-- Adds a single JSONB column rather than individual columns for
-- each token (color, font, radius, etc.) for two reasons:
--
--   1. The appearance schema will evolve — new tokens should not
--      require new migrations. A JSONB column lets us add tokens
--      in the registry without touching SQL.
--
--   2. The entire appearance config is always read and written
--      together (the editor saves all tokens at once, the store
--      page injects them all at once). There is no query that
--      needs "just the font" or "just the radius" — so the
--      normalization benefit of separate columns doesn't apply.
--
-- The DEFAULT is a complete, valid appearance config so every
-- existing store row gets a working config immediately without a
-- separate UPDATE pass, and the store page never needs to handle
-- a null appearance.
--
-- Token naming follows the same CSS custom property names that
-- the store page injects at render time, prefixed with `store-`
-- to avoid colliding with the dashboard's own CSS variables.
-- ============================================================

ALTER TABLE public.stores
  ADD COLUMN appearance JSONB NOT NULL DEFAULT '{
    "colors": {
      "accent":      "#7c3aed",
      "background":  "#0f0f0f",
      "surface":     "#1a1a1a",
      "text":        "#f5f5f5",
      "textMuted":   "#a1a1aa",
      "border":      "#27272a"
    },
    "typography": {
      "fontFamily":  "Inter",
      "headingSize": "2xl",
      "bodySize":    "sm",
      "fontWeight":  "semibold"
    },
    "spacing": {
      "containerWidth": "xl",
      "sectionGap":     "10",
      "cardPadding":    "5"
    },
    "buttons": {
      "radius":    "lg",
      "style":     "filled",
      "size":      "md"
    },
    "sections": {
      "showBio":       true,
      "showLinks":     true,
      "showProducts":  true,
      "showSocials":   true,
      "showFooter":    true
    }
  }'::jsonb;

-- No index needed — appearance is always fetched as part of
-- SELECT * FROM stores WHERE user_id = $1, which hits
-- idx_stores_user_id. A GIN index would only help if we ever
-- query across stores by appearance values, which we won't.

-- RLS note: same as 0001 — existing policies already cover this
-- column. The owner UPDATE policy permits writing appearance.
-- The public SELECT policy permits reading it (needed so the
-- store page can inject CSS variables for anonymous visitors).
