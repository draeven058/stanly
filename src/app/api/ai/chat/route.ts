import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages, username } = await request.json();

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response("GOOGLE_GENERATIVE_AI_API_KEY not set", { status: 500 });
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const supabase = await createClient();
  let storeContext = "";

  if (username) {
    const { data: profile } = await supabase
      .from("profiles").select("full_name, bio").eq("username", username).single();
    const { data: products } = await supabase
      .from("products").select("title, price, type").eq("is_published", true).limit(10);

    if (profile || products) {
      storeContext = `
Creator: ${profile?.full_name ?? username}
Bio: ${profile?.bio ?? "Not provided"}
Products:
${(products ?? []).map((p: any) => `- ${p.title} ($${(p.price / 100).toFixed(2)}) — ${p.type}`).join("\n")}`;
    }
  }

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a friendly customer support assistant for a digital creator's store.
Help buyers understand products and guide them to purchase.
Be warm and concise. Max 3 sentences per response.
${storeContext ? `\nSTORE CONTEXT:\n${storeContext}` : ""}`,
    messages,
  });

  return result.toDataStreamResponse();
}
