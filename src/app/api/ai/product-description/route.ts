import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { title, type, price } = await request.json();
  if (!title) return new Response("title is required", { status: 400 });

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response("GOOGLE_GENERATIVE_AI_API_KEY not set", { status: 500 });
  }

  const google = createGoogleGenerativeAI({ apiKey });

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a world-class copywriter for digital creators.
Write compelling product descriptions that convert browsers into buyers.
Use short paragraphs. No bullet points. Max 3 paragraphs.
Focus on transformation and value.`,
    prompt: `Write a product description for:
Title: "${title}"
Type: ${type ?? "digital product"}
Price: $${price ? (price / 100).toFixed(2) : "TBD"}`,
  });

  return result.toDataStreamResponse();
}
