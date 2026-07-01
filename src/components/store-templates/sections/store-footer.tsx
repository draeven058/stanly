import { Zap } from "lucide-react";

export function StoreFooter() {
  return (
    <div className="mt-14 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/40">
      <Zap className="h-3 w-3" fill="currentColor" />
      Powered by Stanly
    </div>
  );
}
