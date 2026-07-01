import type { Profile } from "@/types";
import type { StoreTemplateRegistryEntry } from "./registry";

// ============================================================
// Template access control
//
// This function is the ONLY place that should ever decide
// "is this user allowed to use this template." Keeping every
// call site (Gallery page, future settings page, the server
// action that persists template_id) routed through here means
// the billing logic only has to be written once, in one place.
//
// Current behavior (no billing system exists yet):
//   - free templates: always allowed
//   - premium templates: never allowed (hard-coded false)
//
// This is intentionally pessimistic rather than optimistic —
// a stub that defaults to "allowed" would mean every premium
// template is accidentally free until someone remembers to
// lock it down. Defaulting to "denied" is the safer failure mode.
//
// When a real plan/subscription system exists, this becomes:
//
//   export function canUseTemplate(
//     profile: Pick<Profile, "id"> & { plan?: string },
//     template: StoreTemplateRegistryEntry
//   ): boolean {
//     if (template.tier === "free") return true;
//     return profile.plan === "pro" || profile.plan === "premium";
//   }
//
// Note the signature already accepts `profile` even though it's
// unused today — this is so call sites don't need to change when
// the real check is implemented, only this function's body does.
// ============================================================

export function canUseTemplate(
  _profile: Pick<Profile, "id">,
  template: StoreTemplateRegistryEntry
): boolean {
  if (template.tier === "free") return true;
  return false;
}
