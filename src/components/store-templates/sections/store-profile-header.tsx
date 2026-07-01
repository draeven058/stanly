import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Youtube, Globe } from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface StoreProfileHeaderProps {
  profile: Profile;
  username: string;
  themeColor: string;
  // "centered" = small circular avatar, centered text (Minimal).
  // "hero" = large avatar, left-aligned on wide screens, designed
  // to sit on top of a banner/gradient (Bold).
  variant?: "centered" | "hero";
}

export function StoreProfileHeader({
  profile,
  username,
  themeColor,
  variant = "centered",
}: StoreProfileHeaderProps) {
  const socialLinks = [
    { href: profile.twitter_url, icon: Twitter, label: "Twitter" },
    { href: profile.instagram_url, icon: Instagram, label: "Instagram" },
    { href: profile.youtube_url, icon: Youtube, label: "YouTube" },
    { href: profile.website, icon: Globe, label: "Website" },
  ].filter((s) => s.href);

  const isHero = variant === "hero";
  const avatarSize = isHero ? 144 : 112;

  return (
    <div className={cn(isHero ? "text-center sm:text-left" : "text-center")}>
      <div
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full border-4 border-background",
          isHero ? "h-36 w-36" : "h-28 w-28"
        )}
        style={{ backgroundColor: themeColor }}
      >
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name ?? username}
            width={avatarSize}
            height={avatarSize}
            className="object-cover"
          />
        ) : (
          <span className={cn("font-bold text-white", isHero ? "text-4xl" : "text-3xl")}>
            {getInitials(profile.full_name ?? username)}
          </span>
        )}
      </div>

      <h1 className={cn("mt-4 font-bold", isHero ? "text-4xl" : "text-2xl")}>
        {profile.full_name ?? username}
      </h1>
      <p className="text-sm text-muted-foreground">@{username}</p>

      {profile.bio && (
        <p
          className={cn(
            "mt-3 text-sm text-muted-foreground leading-relaxed",
            isHero ? "max-w-md mx-auto sm:mx-0" : "max-w-sm mx-auto"
          )}
        >
          {profile.bio}
        </p>
      )}

      {socialLinks.length > 0 && (
        <div
          className={cn(
            "mt-4 flex items-center gap-3",
            isHero ? "justify-center sm:justify-start" : "justify-center"
          )}
        >
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
  );
}
