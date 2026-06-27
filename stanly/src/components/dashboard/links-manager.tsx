"use client";

import { useActionState, useState, useTransition, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import {
  GripVertical, Plus, Trash2, Pencil, Eye, EyeOff,
  ExternalLink, Link2, Loader2, X, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { createLink, deleteLink, toggleLink, updateLink } from "@/actions/links";
import type { Link } from "@/types";
import { cn } from "@/lib/utils";

function AddLinkButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Add link
    </Button>
  );
}

interface LinkRowProps {
  link: Link;
  onDelete: (id: string) => void;
  onToggle: (id: string, current: boolean) => void;
}

function LinkRow({ link, onDelete, onToggle }: LinkRowProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const boundUpdate = updateLink.bind(null, link.id);
  const [state, formAction] = useActionState(boundUpdate, {});

  function handleDelete() {
    if (!confirm("Delete this link?")) return;
    startTransition(async () => {
      await onDelete(link.id);
    });
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-primary/40 bg-card p-4">
        {state.error && (
          <p className="mb-3 text-xs text-destructive">{state.error}</p>
        )}
        <form
          action={async (fd) => {
            await formAction(fd);
            if (!state.error) setEditing(false);
          }}
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`title-${link.id}`} className="text-xs">Title</Label>
              <Input
                id={`title-${link.id}`}
                name="title"
                defaultValue={link.title}
                placeholder="My link"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`url-${link.id}`} className="text-xs">URL</Label>
              <Input
                id={`url-${link.id}`}
                name="url"
                type="url"
                defaultValue={link.url}
                placeholder="https://..."
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
            <Button type="submit" size="sm">
              <Check className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-opacity",
          !link.is_active && "opacity-50",
          isPending && "opacity-40 pointer-events-none"
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{link.title}</p>
          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Switch
            checked={link.is_active}
            onCheckedChange={() => onToggle(link.id, link.is_active)}
            className="scale-90"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </>
  );
}

interface LinksManagerProps {
  links: Link[];
}

export function LinksManager({ links: initialLinks }: LinksManagerProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [addState, addFormAction] = useActionState(createLink, {});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteLink(id);
      if (result.error) {
        setToast({ msg: result.error, type: "error" });
      } else {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        setToast({ msg: "Link deleted", type: "success" });
      }
    });
  }

  async function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleLink(id, current);
      if (result.error) {
        setToast({ msg: result.error, type: "error" });
      } else {
        setLinks((prev) =>
          prev.map((l) => (l.id === id ? { ...l, is_active: !current } : l))
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Add link form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            Add a link
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addState.error && (
            <p className="mb-3 text-sm text-destructive">{addState.error}</p>
          )}
          {addState.success && (
            <p className="mb-3 text-sm text-emerald-500">{addState.success}</p>
          )}
          <form
            action={async (fd) => {
              await addFormAction(fd);
              // Reset is handled by revalidatePath refresh
            }}
            className="space-y-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="My YouTube channel"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://youtube.com/@you"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <AddLinkButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Link list */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
            <ExternalLink className="h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm font-medium">No links yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add links to show on your public store page.
            </p>
          </div>
        ) : (
          links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
