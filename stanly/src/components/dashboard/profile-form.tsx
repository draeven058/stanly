"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/dashboard/file-upload";
import { AIBioGenerator } from "@/components/ai/ai-bio-generator";
import { updateProfile } from "@/actions/profile";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Save changes
    </Button>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, {});
  const bioRef = useRef<HTMLTextAreaElement>(null);

  function handleAcceptBio(text: string) {
    if (bioRef.current) {
      bioRef.current.value = text;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      )?.set;
      setter?.call(bioRef.current, text);
      bioRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{state.error}</div>
      )}
      {state.success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">{state.success}</div>
      )}

      {/* Avatar */}
      <Card>
        <CardHeader><CardTitle className="text-base">Profile photo</CardTitle></CardHeader>
        <CardContent>
          <FileUpload
            mode="avatar"
            currentUrl={profile.avatar_url}
            accept="image/png,image/jpeg,image/webp"
            label={`Upload photo for ${getInitials(profile.full_name ?? profile.username)}`}
            hint="PNG, JPG or WebP · max 5 MB"
          />
        </CardContent>
      </Card>

      {/* Profile info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Jane Smith" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={profile.website ?? ""} placeholder="https://yoursite.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              ref={bioRef}
              defaultValue={profile.bio ?? ""}
              placeholder="Tell people about yourself..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Shown on your public store page.</p>
          </div>

          {/* ✨ AI Bio Generator */}
          <AIBioGenerator
            name={profile.full_name ?? profile.username}
            onAccept={handleAcceptBio}
          />
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader><CardTitle className="text-base">Social links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "twitter_url",   label: "Twitter / X",  value: profile.twitter_url,   placeholder: "https://twitter.com/username" },
            { id: "instagram_url", label: "Instagram",    value: profile.instagram_url, placeholder: "https://instagram.com/username" },
            { id: "youtube_url",   label: "YouTube",      value: profile.youtube_url,   placeholder: "https://youtube.com/@channel" },
          ].map(({ id, label, value, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} name={id} type="url" defaultValue={value ?? ""} placeholder={placeholder} />
            </div>
          ))}
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
