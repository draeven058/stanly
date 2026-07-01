import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { name, niche, tone } = await request.json();
  if (!name) return new Response("name is required", { status: 400 });

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response("GOOGLE_GENERATIVE_AI_API_KEY not set", { status: 500 });
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: `You are an expert personal brand copywriter.
Write short punchy creator bios — max 2 sentences.
No hashtags. Make the reader want to explore the store.`,
    prompt: `Write a creator bio for:
Name: ${name}
Niche: ${niche ?? "content creation"}
Tone: ${tone ?? "professional but approachable"}
Write exactly 2 sentences.`,
  });

  return result.toDataStreamResponse();
}
