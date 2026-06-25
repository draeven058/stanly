"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ActionState } from "./auth";

const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(60),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
});

export async function createLink(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const result = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    icon: formData.get("icon") || undefined,
  });
  if (!result.success) return { error: result.error.errors[0].message };

  // Get next sort_order
  const { count } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { error } = await supabase.from("links").insert({
    profile_id: user.id,
    sort_order: count ?? 0,
    ...result.data,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/links");
  return { success: "Link added" };
}

export async function updateLink(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const result = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    icon: formData.get("icon") || undefined,
  });
  if (!result.success) return { error: result.error.errors[0].message };

  const { error } = await supabase
    .from("links")
    .update(result.data)
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/links");
  return { success: "Link updated" };
}

export async function deleteLink(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/links");
  return { success: "Link deleted" };
}

export async function toggleLink(id: string, isActive: boolean): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("links")
    .update({ is_active: !isActive })
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/links");
  return { success: `Link ${!isActive ? "enabled" : "disabled"}` };
}

export async function reorderLinks(ids: string[]): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates = ids.map((id, index) =>
    supabase
      .from("links")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("profile_id", user.id)
  );

  await Promise.all(updates);
  revalidatePath("/dashboard/links");
  return { success: "Order saved" };
}
