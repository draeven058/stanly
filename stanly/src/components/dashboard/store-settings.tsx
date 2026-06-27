"use client";

import Link from "next/link";
import { ExternalLink, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCopy } from "@/hooks/use-copy";
import { AIStoreNameGenerator } from "@/components/ai/ai-store-name-generator";
import type { Profile, Store } from "@/types";

interface StoreSettingsProps {
  profile: Profile;
  store: Store | null;
}

export function StoreSettings({ profile, store }: StoreSettingsProps) {
  const storeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/store/${profile.username}`;
  const { copy, copied } = useCopy();

  function handleSelectName(name: string, tagline: string) {
    // Could wire to a server action to update store name
    console.log("Selected:", name, tagline);
  }

  return (
    <div className="space-y-6">
      {/* Store link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your store link</CardTitle>
          <CardDescription>Share this with your audience to showcase your products.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <span className="flex-1 font-mono text-sm text-muted-foreground truncate">
              /store/{profile.username}
            </span>
            <button
              onClick={() => copy(`/store/${profile.username}`)}
              className="shrink-0 rounded-md p-1.5 hover:bg-accent transition-colors"
              title="Copy link"
            >
              {copied
                ? <Check className="h-4 w-4 text-emerald-500" />
                : <Copy className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
          <Button asChild>
            <Link href={`/store/${profile.username}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Open store
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* ✨ AI Store Name Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Store Name & Tagline</CardTitle>
          <CardDescription>
            Not sure what to call your store? Let AI brainstorm ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIStoreNameGenerator
            creatorName={profile.full_name ?? profile.username}
            onSelect={handleSelectName}
          />
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader><CardTitle className="text-base">Store status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${store?.is_active !== false ? "bg-emerald-500" : "bg-muted-foreground"}`} />
            <span className="text-sm font-medium">
              {store?.is_active !== false ? "Live — your store is public" : "Hidden"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { label: "Username",   value: `@${profile.username}` },
              { label: "Store name", value: store?.name ?? profile.username },
              { label: "Theme",      value: store?.theme_color ?? "#7c3aed" },
              { label: "Products",   value: "See Products tab" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup checklist</CardTitle>
          <CardDescription>Complete these steps to maximise your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              { label: "Add a profile photo",    done: !!profile.avatar_url,  href: "/dashboard/settings" },
              { label: "Write a bio",            done: !!profile.bio,         href: "/dashboard/settings" },
              { label: "Create your first product", done: false,              href: "/dashboard/products/new" },
              { label: "Add social links",       done: !!(profile.twitter_url || profile.instagram_url || profile.youtube_url), href: "/dashboard/settings" },
              { label: "Add custom links",       done: false,                 href: "/dashboard/links" },
            ].map(({ label, done, href }) => (
              <li key={label} className="flex items-center gap-3">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${done ? "bg-emerald-500 text-white" : "border-2 border-border text-muted-foreground"}`}>
                  {done ? "✓" : ""}
                </div>
                <span className={`text-sm flex-1 ${done ? "line-through text-muted-foreground" : ""}`}>
                  {label}
                </span>
                {!done && (
                  <Link href={href} className="text-xs text-primary hover:underline shrink-0">
                    Do it →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
