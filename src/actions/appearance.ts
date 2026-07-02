"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "./products";
import type { ActionState } from "./auth";
import type { StoreAppearance } from "@/types";

export async function saveAppearance(
  appearance: StoreAppearance
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Basic shape validation — we trust the TypeScript types at
  // compile time but a direct API call could bypass them.
  if (
    !appearance?.colors ||
    !appearance?.typography ||
    !appearance?.spacing ||
    !appearance?.buttons ||
    !appearance?.sections
  ) {
    return { error: "Invalid appearance configuration" };
  }

  const store = await getOrCreateStore(user.id);

  const { error } = await supabase
    .from("stores")
    .update({
      appearance,
      // Keep theme_color in sync with the accent color so
      // existing code that reads store.theme_color (the template
      // renderer, the AI chat widget) stays correct without
      // needing to read the full appearance blob.
      theme_color: appearance.colors.accent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", store.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/appearance");
  revalidatePath(`/store/${store.slug}`);

  return { success: "Appearance saved" };
}
