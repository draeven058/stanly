"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AIBioGeneratorProps {
  name: string;
  onAccept: (text: string) => void;
}

export function AIBioGenerator({ name, onAccept }: AIBioGeneratorProps) {
  const [expanded, setExpanded] = useState(false);
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("professional but approachable");

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/ai/bio",
  });

  async function handleGenerate() {
    await complete("", { body: { name, niche, tone } });
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-sm font-medium text-primary"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Bio Generator
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="space-y-3 pt-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Your niche / topic</Label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. fitness, coding, photography"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tone</Label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-3 text-xs"
              >
                <option>professional but approachable</option>
                <option>casual and fun</option>
                <option>bold and confident</option>
                <option>warm and inspiring</option>
              </select>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-8 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : completion ? <RefreshCw className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {isLoading ? "Writing..." : completion ? "Regenerate bio" : "Generate bio"}
          </Button>

          {(isLoading || completion) && (
            <div className={cn(
              "rounded-lg bg-background border border-border p-3 text-sm leading-relaxed",
              isLoading && "animate-pulse"
            )}>
              {completion || <span className="text-muted-foreground">Writing your bio…</span>}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-xs text-destructive">
                Failed to generate. Make sure GOOGLE_GENERATIVE_AI_API_KEY is set in Vercel.
              </p>
            </div>
          )}

          {completion && !isLoading && (
            <Button
              type="button"
              size="sm"
              onClick={() => { onAccept(completion); setExpanded(false); }}
              className="w-full"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use this bio
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
