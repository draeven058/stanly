-- ============================================================
-- Migration: add landing page template system to stores
-- Stage 2 of the Landing Page Template System rollout.
-- (Stage 1 — extracting the current store page into the
--  `minimal` template component — is a code-only change and
--  has no SQL counterpart.)
--
-- Safe to run on a live database with existing rows:
--   - column is NOT NULL with a DEFAULT, so every existing
--     store is backfilled to 'minimal' automatically
--   - no existing column is renamed, dropped, or retyped
--   - no existing RLS policy is modified
-- ============================================================

-- ----------------------------------------------------------------
-- 1. Enum for valid template ids
--
-- An enum (vs. a free-text column) means an invalid template_id
-- is rejected at the database layer, not just in app code — so a
-- direct SQL insert/update can't silently put a store into a
-- template that doesn't exist.
--
-- Trade-off: adding a new template later requires a migration to
-- extend this enum (see "Adding a new template" note at bottom).
-- That's intentional — it keeps the registry in `lib/templates/`
-- and the database in lockstep instead of letting them drift.
-- ----------------------------------------------------------------
CREATE TYPE store_template_id AS ENUM ('minimal', 'bold', 'gallery');

-- ----------------------------------------------------------------
-- 2. Add the column
--
-- DEFAULT 'minimal' is what makes this non-breaking: every store
-- row that exists right now gets 'minimal' the instant this runs,
-- with no separate UPDATE statement needed and no NULL window.
-- ----------------------------------------------------------------
ALTER TABLE public.stores
  ADD COLUMN template_id store_template_id NOT NULL DEFAULT 'minimal';

-- ----------------------------------------------------------------
-- 3. Index
--
-- Not required for correctness — added because the dashboard will
-- eventually want "stores using template X" type queries (e.g. to
-- measure template popularity), and an enum column is cheap to index.
-- ----------------------------------------------------------------
CREATE INDEX idx_stores_template_id ON public.stores(template_id);

-- ----------------------------------------------------------------
-- 4. RLS — explicitly NOT modified
--
-- The existing policies already cover this column:
--
--   "Stores are viewable by everyone"
--     ON public.stores FOR SELECT USING (TRUE)
--   -> template_id is publicly readable, which is required: the
--      public /store/[username] page must read it to know which
--      template component to render for anonymous visitors.
--
--   "Users can manage their own store"
--     ON public.stores FOR ALL USING (auth.uid() = user_id)
--   -> already permits the owner to UPDATE template_id along with
--      every other store column. No new policy needed.
--
-- Premium-tier gating (whether a user is ALLOWED to set
-- template_id = 'gallery') is deliberately NOT enforced here.
-- RLS governs row ownership/visibility, not plan entitlements —
-- enforcing "is this user on a paid plan" in SQL would mean
-- duplicating billing logic in two places (Postgres + app code)
-- the moment a subscriptions table exists. That check belongs in
-- the updateStoreTemplate() server action via
-- lib/templates/access.ts -> canUseTemplate(), where it can be
-- unit tested and changed without a migration.
-- ----------------------------------------------------------------

-- ----------------------------------------------------------------
-- Adding a new template later (e.g. 'editorial'):
--
--   ALTER TYPE store_template_id ADD VALUE 'editorial';
--
-- Note: ALTER TYPE ... ADD VALUE cannot run inside the same
-- transaction block as other schema changes in Postgres < 12,
-- and on Supabase must be run as its own migration/statement.
-- ----------------------------------------------------------------
