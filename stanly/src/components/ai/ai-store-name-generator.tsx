"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  name: string;
  tagline: string;
  reasoning: string;
}

interface AIStoreNameGeneratorProps {
  creatorName: string;
  onSelect: (name: string, tagline: string) => void;
}

export function AIStoreNameGenerator({ creatorName, onSelect }: AIStoreNameGeneratorProps) {
  const [niche, setNiche] = useState("");
  const [style, setStyle] = useState("modern and professional");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setSelected(null);
    try {
      const res = await fetch("/api/ai/store-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: creatorName, niche, style }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch {
      setError("Failed to generate names. Check your OpenAI API key.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(index: number) {
    setSelected(index);
    onSelect(suggestions[index].name, suggestions[index].tagline);
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        AI Store Name & Tagline Generator
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Your niche</Label>
          <Input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. design templates, fitness coaching"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Style</Label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-3 text-xs"
          >
            <option>modern and professional</option>
            <option>bold and edgy</option>
            <option>warm and friendly</option>
            <option>minimal and clean</option>
            <option>playful and fun</option>
          </select>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : suggestions.length > 0 ? (
          <RefreshCw className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {suggestions.length > 0 ? "Generate more ideas" : "Generate 5 name ideas"}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              className={`w-full rounded-lg border p-3 text-left transition-all ${
                selected === i
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{s.name}</span>
                    {selected === i && (
                      <Badge variant="default" className="text-[10px] h-4 px-1.5">
                        <Check className="h-2.5 w-2.5 mr-0.5" /> Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-primary mt-0.5 font-medium">"{s.tagline}"</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.reasoning}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
