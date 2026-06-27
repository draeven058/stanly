"use client";

import { useCompletion } from "ai/react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIDescriptionWriterProps {
  title: string;
  type: string;
  price: string;
  onAccept: (text: string) => void;
}

export function AIDescriptionWriter({
  title,
  type,
  price,
  onAccept,
}: AIDescriptionWriterProps) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/ai/product-description",
  });

  async function handleGenerate() {
    if (!title.trim()) return;
    await complete("", {
      body: {
        title,
        type,
        price: parseFloat(price || "0") * 100,
      },
    });
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI Description Writer
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleGenerate}
          disabled={isLoading || !title.trim()}
          className="h-7 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : completion ? (
            <RefreshCw className="h-3 w-3" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {completion ? "Regenerate" : "Generate"}
        </Button>
      </div>

      {!completion && !isLoading && (
        <p className="text-xs text-muted-foreground">
          {title.trim()
            ? `Click Generate to write a description for "${title}"`
            : "Enter a product title first, then click Generate"}
        </p>
      )}

      {(isLoading || completion) && (
        <div
          className={cn(
            "rounded-lg bg-background border border-border p-3 text-sm leading-relaxed min-h-[80px]",
            isLoading && "animate-pulse"
          )}
        >
          {completion || (
            <span className="text-muted-foreground">Writing your description…</span>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">
          Error generating description. Check your OpenAI API key.
        </p>
      )}

      {completion && !isLoading && (
        <Button
          type="button"
          size="sm"
          onClick={() => onAccept(completion)}
          className="w-full"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Use this description
        </Button>
      )}
    </div>
  );
}
