"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Store,
  Settings, BarChart3, Zap, LogOut, Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

const navItems = [
  { href: "/dashboard",            label: "Overview",   icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products",   label: "Products",   icon: Package },
  { href: "/dashboard/orders",     label: "Orders",     icon: ShoppingBag },
  { href: "/dashboard/store",      label: "Store",      icon: Store },
  { href: "/dashboard/links",      label: "Links",      icon: Link2 },
  { href: "/dashboard/analytics",  label: "Analytics",  icon: BarChart3 },
  { href: "/dashboard/settings",   label: "Settings",   icon: Settings },
];

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" fill="currentColor" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">Stanly</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(profile.full_name ?? profile.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile.full_name ?? profile.username}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              @{profile.username}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
