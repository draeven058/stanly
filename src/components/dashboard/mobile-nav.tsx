"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Zap, LayoutDashboard, Package,
  ShoppingBag, Store, BarChart3, Settings, Link2, LayoutGrid, Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/dashboard",           label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products",  label: "Products",  icon: Package },
  { href: "/dashboard/orders",    label: "Orders",    icon: ShoppingBag },
  { href: "/dashboard/store",     label: "Store",     icon: Store },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutGrid },
  { href: "/dashboard/appearance",label: "Appearance",icon: Palette },
  { href: "/dashboard/links",     label: "Links",     icon: Link2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-bold">Stanly</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-1.5 hover:bg-accent transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background pt-14 md:hidden overflow-y-auto">
          <nav className="space-y-1 p-4">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-foreground/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border mx-4 mt-2 pt-4">
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
