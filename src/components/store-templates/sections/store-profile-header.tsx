import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Youtube, Globe } from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface StoreProfileHeaderProps {
  profile: Profile;
  username: string;
  themeColor: string;
  variant?: "centered" | "hero";
  showBio?: boolean;
  showSocials?: boolean;
}

export function StoreProfileHeader({
  profile,
  username,
  themeColor,
  variant = "centered",
  showBio = true,
  showSocials = true,
}: StoreProfileHeaderProps) {
  const socialLinks = [
    { href: profile.twitter_url,   icon: Twitter,   label: "Twitter" },
    { href: profile.instagram_url, icon: Instagram, label: "Instagram" },
    { href: profile.youtube_url,   icon: Youtube,   label: "YouTube" },
    { href: profile.website,       icon: Globe,     label: "Website" },
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

      <h1
        className="mt-4"
        style={{
          fontFamily: "var(--store-font-family)",
          fontSize:   "var(--store-heading-size)",
          fontWeight: "var(--store-font-weight)",
          color:      "var(--store-text)",
        }}
      >
        {profile.full_name ?? username}
      </h1>

      <p style={{ fontSize: "var(--store-body-size)", color: "var(--store-text-muted)" }}>
        @{username}
      </p>

      {showBio && profile.bio && (
        <p
          className={cn("mt-3 leading-relaxed", isHero ? "max-w-md mx-auto sm:mx-0" : "max-w-sm mx-auto")}
          style={{ fontSize: "var(--store-body-size)", color: "var(--store-text-muted)" }}
        >
          {profile.bio}
        </p>
      )}

      {showSocials && socialLinks.length > 0 && (
        <div className={cn("mt-4 flex items-center gap-3", isHero ? "justify-center sm:justify-start" : "justify-center")}>
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--store-surface)",
                border:          "1px solid var(--store-border)",
                color:           "var(--store-text-muted)",
              }}
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
