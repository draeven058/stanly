import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { niche, name, style } = await request.json();

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      suggestions: z.array(
        z.object({
          name: z.string().describe("Store name, 1-3 words"),
          tagline: z.string().describe("Catchy tagline under 8 words"),
          reasoning: z.string().describe("One sentence why this works"),
        })
      ).length(5),
    }),
    prompt: `Generate 5 creative store name + tagline combinations for a digital creator:
Creator name: ${name ?? "unknown"}
Niche: ${niche ?? "general content"}
Style preference: ${style ?? "modern and professional"}

Names should be: memorable, available as a username, relevant to the niche.
Taglines should be: punchy, benefit-focused, under 8 words.`,
  });

  return Response.json(result.object);
}
