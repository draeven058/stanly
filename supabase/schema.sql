-- ============================================================
-- Stanly Platform — Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  bio          TEXT,
  avatar_url   TEXT,
  website      TEXT,
  twitter_url  TEXT,
  instagram_url TEXT,
  youtube_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT username_length CHECK (char_length(username) BETWEEN 3 AND 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$')
);

CREATE INDEX idx_profiles_username ON public.profiles(username);

-- ============================================================
-- STORES
-- ============================================================
CREATE TABLE public.stores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  banner_url    TEXT,
  theme_color   TEXT NOT NULL DEFAULT '#7c3aed',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT one_store_per_user UNIQUE (user_id)
);

CREATE INDEX idx_stores_user_id ON public.stores(user_id);
CREATE INDEX idx_stores_slug ON public.stores(slug);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TYPE product_type AS ENUM ('digital', 'course', 'membership', 'link');

CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id      UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0), -- in cents
  type          product_type NOT NULL DEFAULT 'digital',
  file_url      TEXT,
  thumbnail_url TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  slug          TEXT NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_product_slug_per_store UNIQUE (store_id, slug)
);

CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_is_published ON public.products(is_published);
CREATE INDEX idx_products_slug ON public.products(slug);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'refunded', 'failed');

CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  buyer_email       TEXT NOT NULL,
  buyer_name        TEXT,
  amount            INTEGER NOT NULL CHECK (amount >= 0), -- in cents
  status            order_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_product_id ON public.orders(product_id);
CREATE INDEX idx_orders_buyer_email ON public.orders(buyer_email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================================
-- LINKS
-- ============================================================
CREATE TABLE public.links (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  icon        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_links_profile_id ON public.links(profile_id);
CREATE INDEX idx_links_sort ON public.links(profile_id, sort_order);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER stores_updated_at   BEFORE UPDATE ON public.stores   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links    ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- STORES
CREATE POLICY "Stores are viewable by everyone"
  ON public.stores FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own store"
  ON public.stores FOR ALL USING (auth.uid() = user_id);

-- PRODUCTS
CREATE POLICY "Published products are viewable by everyone"
  ON public.products FOR SELECT
  USING (
    is_published = TRUE
    OR EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.id = store_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can manage their products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.id = store_id AND s.user_id = auth.uid()
    )
  );

-- ORDERS
CREATE POLICY "Store owners can view their orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.stores s ON s.id = p.store_id
      WHERE p.id = product_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create an order"
  ON public.orders FOR INSERT WITH CHECK (TRUE);

-- LINKS
CREATE POLICY "Links are viewable by everyone"
  ON public.links FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage their own links"
  ON public.links FOR ALL USING (auth.uid() = profile_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('store-assets', 'store-assets', TRUE) ON CONFLICT DO NOTHING;

-- Storage RLS
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::TEXT = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Store owners can upload product files"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'product-files' AND auth.uid()::TEXT = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Authenticated users can access purchased files"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'product-files' AND auth.role() = 'authenticated'
  );
