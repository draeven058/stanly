import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { stats, products, recentOrders } = await request.json();

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
        action: z.string().describe("The single most impactful thing to do now"),
        expectedImpact: z.string().describe("What result this will have"),
      }),
    }),
    prompt: `Analyze this creator store performance and give actionable insights:

Revenue (30 days): $${((stats?.total_revenue ?? 0) / 100).toFixed(2)}
Orders (30 days): ${stats?.total_orders ?? 0}
Total products: ${stats?.total_products ?? 0}
Page views: ${stats?.total_views ?? 0}
Conversion rate: ${stats?.total_views ? ((stats.total_orders / stats.total_views) * 100).toFixed(1) : 0}%
Products: ${JSON.stringify(products?.slice(0, 5) ?? [])}

Give honest, specific, actionable insights. Be direct.`,
  });

  return Response.json(result.object);
}
