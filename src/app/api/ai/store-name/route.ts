import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { niche, name, style } = await request.json();

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response("GOOGLE_GENERATIVE_AI_API_KEY not set", { status: 500 });
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const result = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: z.object({
      suggestions: z.array(z.object({
        name: z.string().describe("Store name, 1-3 words"),
        tagline: z.string().describe("Catchy tagline under 8 words"),
        reasoning: z.string().describe("One sentence why this works"),
      })).length(5),
    }),
    prompt: `Generate 5 creative store name + tagline combinations:
Creator name: ${name ?? "unknown"}
Niche: ${niche ?? "general content"}
Style: ${style ?? "modern and professional"}
Names should be memorable and relevant to the niche.
Taglines should be punchy and benefit-focused.`,
  });

  return Response.json(result.object);
}
