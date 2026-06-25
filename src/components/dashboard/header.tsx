import Link from "next/link";
import { ExternalLink, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  profile: Profile;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, description, profile, action }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/store/${profile.username}`} target="_blank">
            <ExternalLink className="h-3.5 w-3.5" />
            View store
          </Link>
        </Button>
        {action}
      </div>
    </div>
  );
}
