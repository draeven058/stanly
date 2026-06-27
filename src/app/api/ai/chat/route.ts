import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages, username } = await request.json();

  const supabase = await createClient();
  let storeContext = "";

  if (username) {
    const { data: profile } = await supabase
      .from("profiles").select("full_name, bio").eq("username", username).single();
    const { data: products } = await supabase
      .from("products").select("title, description, price, type")
      .eq("is_published", true).limit(10);

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
Be warm and concise. Keep responses under 3 sentences when possible.
Never make up info not in the store context.
${storeContext ? `\nSTORE CONTEXT:\n${storeContext}` : ""}`,
    messages,
  });

  return result.toDataStreamResponse();
}
