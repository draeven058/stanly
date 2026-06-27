"use client";

import { useState } from "react";
import {
  Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb,
  ChevronDown, ChevronUp, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InsightType = "positive" | "warning" | "opportunity";

interface Insight {
  type: InsightType;
  title: string;
  detail: string;
}

interface AnalyticsInsightsData {
  summary: string;
  insights: Insight[];
  topRecommendation: {
    action: string;
    expectedImpact: string;
  };
}

interface AIAnalyticsInsightsProps {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_views: number;
  };
  products?: { title: string; price: number; type: string }[];
  recentOrders?: unknown[];
}

const INSIGHT_CONFIG: Record<InsightType, { icon: typeof TrendingUp; color: string; bg: string }> = {
  positive:    { icon: TrendingUp,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
  warning:     { icon: AlertTriangle,  color: "text-amber-500",   bg: "bg-amber-500/10"   },
  opportunity: { icon: Lightbulb,      color: "text-blue-500",    bg: "bg-blue-500/10"    },
};

export function AIAnalyticsInsights({ stats, products, recentOrders }: AIAnalyticsInsightsProps) {
  const [data, setData] = useState<AnalyticsInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  async function handleAnalyze() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats, products, recentOrders }),
      });
      const result = await res.json();
      setData(result);
      setExpanded(true);
    } catch {
      setError("Failed to analyze. Check your OpenAI API key.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            AI Analytics Insights
          </CardTitle>
          {data && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!data && !isLoading && (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Get AI-powered insights about your store performance and actionable recommendations.
            </p>
            <Button onClick={handleAnalyze} size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Analyze my store
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your store performance…</p>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {data && expanded && (
          <div className="space-y-4">
            {/* Summary */}
            <p className="text-sm leading-relaxed text-foreground/80">{data.summary}</p>

            {/* Insights */}
            <div className="space-y-2">
              {data.insights.map((insight, i) => {
                const config = INSIGHT_CONFIG[insight.type];
                const Icon = config.icon;
                return (
                  <div
                    key={i}
                    className={cn("flex gap-3 rounded-lg p-3", config.bg)}
                  >
                    <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", config.color)}>{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top recommendation */}
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <Zap className="h-4 w-4" fill="currentColor" />
                Top recommendation
              </div>
              <p className="text-sm font-medium">{data.topRecommendation.action}</p>
              <p className="text-xs text-muted-foreground mt-1">{data.topRecommendation.expectedImpact}</p>
            </div>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full border-primary/20 text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Refresh insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
