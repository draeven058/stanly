"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ActionState } from "./auth";

const profileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  youtube_url: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const result = profileSchema.safeParse({
    full_name: formData.get("full_name") || undefined,
    bio: formData.get("bio") || undefined,
    website: formData.get("website") || "",
    twitter_url: formData.get("twitter_url") || "",
    instagram_url: formData.get("instagram_url") || "",
    youtube_url: formData.get("youtube_url") || "",
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: "Profile updated successfully" };
}

export async function uploadAvatar(
  file: File
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  return { url: data.publicUrl };
}
