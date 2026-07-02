"use client";

import { useEffect, useRef } from "react";
import { generateStoreCSSVars } from "@/lib/appearance/css-vars";
import { MinimalTemplate } from "@/components/store-templates/minimal/minimal-template";
import type { StoreAppearance, Profile, Store, Product, Link as StoreLink } from "@/types";
import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  appearance: StoreAppearance;
  profile: Profile;
  store: Store | null;
  products: Product[];
  links: StoreLink[];
}

type Viewport = "desktop" | "mobile";

const VIEWPORT_WIDTH: Record<Viewport, number> = {
  desktop: 960,
  mobile:  390,
};

export function LivePreview({
  appearance,
  profile,
  store,
  products,
  links,
}: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Compute scale so the simulated viewport fits inside the
  // preview container, with a small margin.
  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth - 32; // 16px each side
      const targetW    = VIEWPORT_WIDTH[viewport];
      setScale(Math.min(1, containerW / targetW));
    }
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [viewport]);

  const cssVars  = generateStoreCSSVars(appearance);
  const previewW = VIEWPORT_WIDTH[viewport];

  return (
    <div className="flex flex-col h-full">
      {/* Viewport switcher */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground">Live preview</span>
        <div className="flex gap-1">
          {(["desktop", "mobile"] as Viewport[]).map((v) => {
            const Icon = v === "desktop" ? Monitor : Smartphone;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setViewport(v)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  viewport === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
                title={v.charAt(0).toUpperCase() + v.slice(1)}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview frame */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-muted/10 p-4 flex items-start justify-center"
      >
        <div
          style={{
            width:          previewW,
            transformOrigin: "top center",
            transform:      `scale(${scale})`,
            // Correct the layout height so the container doesn't
            // scroll — the scaled content is visually shorter than
            // its actual DOM height.
            marginBottom:   `calc(${scale * 100 - 100}% - ${(1 - scale) * 600}px)`,
          }}
        >
          {/* Style tag scoped to preview — does not affect dashboard */}
          <style>{`:root { ${cssVars} }`}</style>

          <div
            className="overflow-hidden rounded-xl border border-border shadow-lg"
            style={{ minHeight: 600, pointerEvents: "none" }}
          >
            <MinimalTemplate
              username={profile.username}
              profile={profile}
              store={store}
              products={products}
              links={links}
              appearance={appearance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
