import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getInitials } from "@/lib/utils";
import { AIChatWidget } from "@/components/ai/ai-chat-widget";
import {
  Twitter, Instagram, Youtube, Globe,
  ExternalLink, ShoppingCart, Zap,
} from "lucide-react";

interface StorePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Store not found" };

  return {
    title: profile.full_name ?? username,
    description: profile.bio ?? `Check out ${profile.full_name ?? username}'s store on Stanly.`,
    openGraph: { images: profile.avatar_url ? [profile.avatar_url] : [] },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("username", username).single();
  if (!profile) notFound();

  const { data: store } = await supabase
    .from("stores").select("*").eq("user_id", profile.id).single();

  let products: any[] = [];
  let links: any[] = [];

  if (store) {
    const [productsRes, linksRes] = await Promise.all([
      supabase.from("products").select("*").eq("store_id", store.id).eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("links").select("*").eq("profile_id", profile.id).eq("is_active", true).order("sort_order"),
    ]);
    products = productsRes.data ?? [];
    links = linksRes.data ?? [];
  }

  const TYPE_LABELS: Record<string, string> = {
    digital: "Digital", course: "Course", membership: "Membership", link: "Link",
  };

  const socialLinks = [
    { href: profile.twitter_url,   icon: Twitter,   label: "Twitter" },
    { href: profile.instagram_url, icon: Instagram, label: "Instagram" },
    { href: profile.youtube_url,   icon: Youtube,   label: "YouTube" },
    { href: profile.website,       icon: Globe,     label: "Website" },
  ].filter((s) => s.href);

  return (
    <div className="min-h-svh bg-background">
      {/* Header gradient */}
      <div
        className="h-36"
        style={{
          background: `linear-gradient(135deg, ${store?.theme_color ?? "#7c3aed"}40, ${store?.theme_color ?? "#7c3aed"}10, transparent)`,
        }}
      />

      <div className="mx-auto max-w-xl px-4 pb-28">
        {/* Profile */}
        <div className="-mt-16 text-center">
          <div className="inline-flex h-28 w-28 items-center justify-center rounded-full border-4 border-background overflow-hidden"
            style={{ backgroundColor: store?.theme_color ?? "#7c3aed" }}>
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name ?? username} width={112} height={112} className="object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {getInitials(profile.full_name ?? username)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold">{profile.full_name ?? username}</h1>
          <p className="text-sm text-muted-foreground">@{username}</p>

          {profile.bio && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Custom links */}
        {links.length > 0 && (
          <div className="mt-8 space-y-3">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 font-medium transition-all hover:border-primary/40 hover:bg-accent group"
              >
                <span>{link.title}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Products
            </h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {product.thumbnail_url && (
                    <div className="relative aspect-video">
                      <Image src={product.thumbnail_url} alt={product.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold">{product.title}</h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {TYPE_LABELS[product.type]}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold shrink-0" style={{ color: store?.theme_color ?? "#7c3aed" }}>
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <button
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: store?.theme_color ?? "#7c3aed" }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-14 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/40">
          <Zap className="h-3 w-3" fill="currentColor" />
          Powered by Stanly
        </div>
      </div>

      {/* ✨ AI Chat Widget */}
      <AIChatWidget
        username={username}
        creatorName={profile.full_name ?? username}
        themeColor={store?.theme_color ?? "#7c3aed"}
      />
    </div>
  );
}
