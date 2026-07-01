"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateStore } from "./products";
import { getTemplateById } from "@/lib/templates/store/registry";
import { canUseTemplate } from "@/lib/templates/store/access";
import type { ActionState } from "./auth";
import type { StoreTemplateId } from "@/types";

// ----------------------------------------------------------------
// updateStoreTemplate
//
// This is the ONE place template_id is ever written. The Gallery
// page's "Use Template" button calls this directly (not a form
// action, since there's no form — just a button per card), so it
// takes plain arguments rather than (prevState, formData).
//
// Security note: the picker UI hides/locks premium templates
// visually, but that's cosmetic. canUseTemplate() is called again
// here, server-side, because a client can always bypass UI state
// and call a server action directly. This is the real boundary.
// ----------------------------------------------------------------
export async function updateStoreTemplate(
  templateId: StoreTemplateId
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const template = getTemplateById(templateId);
  if (!template) return { error: "Unknown template" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Profile not found" };

  if (!canUseTemplate(profile, template)) {
    return {
      error: `"${template.label}" is a premium template. Upgrade your plan to use it.`,
    };
  }

  const store = await getOrCreateStore(user.id);

  const { error } = await supabase
    .from("stores")
    .update({ template_id: templateId, updated_at: new Date().toISOString() })
    .eq("id", store.id);

  if (error) return { error: error.message };

  // Both surfaces need to reflect the change: the dashboard (where
  // the picker lives) and the public store page (which renders
  // using this value).
  revalidatePath("/dashboard/templates");
  revalidatePath("/dashboard/store");

  return { success: `"${template.label}" is now your store's template.` };
}
