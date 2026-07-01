import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { stats, products, recentOrders } = await request.json();

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response("GOOGLE_GENERATIVE_AI_API_KEY not set", { status: 500 });
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const result = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: z.object({
      summary: z.string().describe("2-sentence overview of business health"),
      insights: z.array(z.object({
        type: z.enum(["positive", "warning", "opportunity"]),
        title: z.string(),
        detail: z.string(),
      })).min(3).max(5),
      topRecommendation: z.object({
        action: z.string(),
        expectedImpact: z.string(),
      }),
    }),
    prompt: `Analyze this creator store performance:
Revenue (30 days): $${((stats?.total_revenue ?? 0) / 100).toFixed(2)}
Orders: ${stats?.total_orders ?? 0}
Products: ${stats?.total_products ?? 0}
Views: ${stats?.total_views ?? 0}
Conversion: ${stats?.total_views ? ((stats.total_orders / stats.total_views) * 100).toFixed(1) : 0}%
Give honest, specific, actionable insights.`,
  });

  return Response.json(result.object);
}
