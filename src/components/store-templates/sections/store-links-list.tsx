import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Link as StoreLink } from "@/types";

interface StoreLinksListProps {
  links: StoreLink[];
}

export function StoreLinksList({ links }: StoreLinksListProps) {
  if (links.length === 0) return null;

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3.5 font-medium transition-all group"
          style={{
            backgroundColor: "var(--store-surface)",
            border: "1px solid var(--store-border)",
            borderRadius: "var(--store-btn-radius)",
            color: "var(--store-text)",
            fontSize: "var(--store-body-size)",
          }}
        >
          <span>{link.title}</span>
          <ExternalLink
            className="h-4 w-4 transition-colors"
            style={{ color: "var(--store-text-muted)" }}
          />
        </Link>
      ))}
    </div>
  );
}
