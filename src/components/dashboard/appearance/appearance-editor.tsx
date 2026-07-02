"use client";

import { useState, useTransition, useCallback } from "react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { EditorControls } from "./editor-controls";
import { LivePreview } from "./live-preview";
import { saveAppearance } from "@/actions/appearance";
import { DEFAULT_APPEARANCE } from "@/lib/appearance/defaults";
import type { StoreAppearance, Profile, Store, Product, Link as StoreLink } from "@/types";

interface AppearanceEditorProps {
  initialAppearance: StoreAppearance;
  profile: Profile;
  store: Store | null;
  products: Product[];
  links: StoreLink[];
}

export function AppearanceEditor({
  initialAppearance,
  profile,
  store,
  products,
  links,
}: AppearanceEditorProps) {
  const [appearance, setAppearance] = useState<StoreAppearance>(initialAppearance);
  const [isDirty, setIsDirty]       = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleChange = useCallback((updated: StoreAppearance) => {
    setAppearance(updated);
    setIsDirty(true);
  }, []);

  function handleReset() {
    setAppearance(initialAppearance);
    setIsDirty(false);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveAppearance(appearance);
      if (result.error) {
        setToast({ message: result.error, type: "error" });
      } else {
        setToast({ message: result.success ?? "Appearance saved", type: "success" });
        setIsDirty(false);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isDirty
            ? "You have unsaved changes — preview is live, public store is not yet updated."
            : "All changes saved."}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty || isPending}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isPending}
          >
            {isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Save className="h-3.5 w-3.5" />}
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Split layout: controls left, preview right */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-[800px]">
        {/* Editor controls — scrollable */}
        <div className="overflow-y-auto pr-1 space-y-0 max-h-[800px] lg:max-h-none">
          <EditorControls appearance={appearance} onChange={handleChange} />
        </div>

        {/* Live preview — sticky on desktop */}
        <div className="rounded-xl border border-border overflow-hidden bg-muted/5 hidden lg:flex flex-col sticky top-6 max-h-[800px]">
          <LivePreview
            appearance={appearance}
            profile={profile}
            store={store}
            products={products}
            links={links}
          />
        </div>
      </div>

      {/* Mobile preview toggle */}
      <div className="lg:hidden rounded-xl border border-border overflow-hidden bg-muted/5">
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
        </div>
        <div className="max-h-[500px] overflow-hidden">
          <LivePreview
            appearance={appearance}
            profile={profile}
            store={store}
            products={products}
            links={links}
          />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
