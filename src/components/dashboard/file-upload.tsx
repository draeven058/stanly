"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadProductFile } from "@/actions/products";
import { uploadAvatar } from "@/actions/profile";

type UploadMode = "product-file" | "avatar";

interface FileUploadProps {
  mode: UploadMode;
  productId?: string;
  currentUrl?: string | null;
  onSuccess?: (url: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
}

export function FileUpload({
  mode,
  productId,
  currentUrl,
  onSuccess,
  accept,
  label = "Upload file",
  hint = "Drag & drop or click to browse",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isImage = mode === "avatar" || accept?.startsWith("image");

  async function handleFile(file: File) {
    setError(null);
    setDone(false);
    setFileName(file.name);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    startTransition(async () => {
      let result: { url: string } | { error: string };

      if (mode === "avatar") {
        result = await uploadAvatar(file);
      } else {
        if (!productId) { setError("No product ID"); return; }
        result = await uploadProductFile(productId, file);
      }

      if ("error" in result) {
        setError(result.error);
      } else {
        setDone(true);
        onSuccess?.(result.url);
      }
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {isPending ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm">Uploading…</p>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-7 w-7" />
            <p className="text-sm font-medium">Uploaded!</p>
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>
        ) : isImage && preview ? (
          <div className="relative h-28 w-28">
            <Image src={preview} alt="Preview" fill className="rounded-lg object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {fileName ? (
              <FileText className="h-7 w-7 text-primary" />
            ) : (
              <Upload className="h-7 w-7" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">{fileName ?? label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <X className="h-3.5 w-3.5" />
          {error}
        </p>
      )}

      {(preview || fileName) && !isPending && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            setFileName(null);
            setDone(false);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
