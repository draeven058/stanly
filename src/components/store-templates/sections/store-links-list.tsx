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
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 font-medium transition-all hover:border-primary/40 hover:bg-accent group"
        >
          <span>{link.title}</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ))}
    </div>
  );
}
