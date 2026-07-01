"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Search, Check, Lock, Sparkles, Loader2, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { updateStoreTemplate } from "@/actions/templates";
import {
  STORE_TEMPLATE_REGISTRY,
  type StoreTemplateCategory,
} from "@/lib/templates/store/registry";
import type { StoreTemplateId } from "@/types";

// "All" is a UI-only pseudo-category — it's not part of
// StoreTemplateCategory because it has no meaning outside this
// filter control (a template is never tagged "all").
type CategoryFilter = StoreTemplateCategory | "all";

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All",
  general: "General",
  creative: "Creative",
  education: "Education",
  ecommerce: "E-commerce",
};

const CATEGORY_OPTIONS: CategoryFilter[] = ["all", "general", "creative", "education", "ecommerce"];

// Separate component (not inline logic) because it needs its own
// `failed` state per card — inlining this in the map() would mean
// every card's error state lives in one shared piece of parent
// state, which would make one broken image incorrectly affect
// every other card's fallback rendering.
function TemplatePreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full items-center justify-center">
        <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

interface TemplateGalleryProps {
  currentTemplateId: StoreTemplateId;
}

export function TemplateGallery({ currentTemplateId }: TemplateGalleryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [activeTemplateId, setActiveTemplateId] = useState<StoreTemplateId>(currentTemplateId);
  const [pendingId, setPendingId] = useState<StoreTemplateId | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filtering is done client-side over the static registry (max a
  // few dozen entries even with many templates) rather than a
  // server round-trip — there's no database query involved since
  // the registry is in-memory config, not a table.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STORE_TEMPLATE_REGISTRY.filter((t) => {
      const matchesCategory = category === "all" || t.category === category;
      const matchesQuery =
        q.length === 0 ||
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleUseTemplate(templateId: StoreTemplateId) {
    setPendingId(templateId);
    startTransition(async () => {
      const result = await updateStoreTemplate(templateId);
      if (result.error) {
        setToast({ message: result.error, type: "error" });
      } else {
        setActiveTemplateId(templateId);
        setToast({ message: result.success ?? "Template updated", type: "success" });
      }
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* Search + category filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setCategory(opt)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === opt
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {CATEGORY_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <LayoutGrid className="h-8 w-8 text-muted-foreground/30" />
          <h3 className="mt-4 text-sm font-semibold">No templates found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const isActive = template.id === activeTemplateId;
            const isLocked = template.tier === "premium";
            const isThisPending = isPending && pendingId === template.id;

            return (
              <Card key={template.id} className="group overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <TemplatePreviewImage
                    src={template.previewImageUrl}
                    alt={`${template.label} template preview`}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                  {isActive && (
                    <div className="absolute left-2 top-2">
                      <Badge variant="success" className="gap-1">
                        <Check className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{template.label}</p>
                      <Badge variant="secondary" className="mt-1 text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <div className="mt-4">
                    {isActive ? (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <Check className="h-3.5 w-3.5" />
                        Currently active
                      </Button>
                    ) : isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() =>
                          setToast({
                            message: `"${template.label}" is a premium template. Upgrade your plan to use it.`,
                            type: "error",
                          })
                        }
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Unlock with Pro
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={isThisPending}
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        {isThisPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {isThisPending ? "Applying…" : "Use Template"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
