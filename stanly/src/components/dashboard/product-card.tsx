"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { deleteProduct, toggleProductPublish } from "@/actions/products";
import { Toast } from "@/components/ui/toast";
import type { Product } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  digital: "Digital",
  course: "Course",
  membership: "Membership",
  link: "Link",
};

export function ProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleProductPublish(product.id, product.is_published);
      if (result.error) setToast({ message: result.error, type: "error" });
      else if (result.success) setToast({ message: result.success, type: "success" });
    });
  }

  function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.error) setToast({ message: result.error, type: "error" });
    });
  }

  return (
    <>
      <Card className="group overflow-hidden">
        <div className="relative aspect-video bg-muted">
          {product.thumbnail_url ? (
            <Image src={product.thumbnail_url} alt={product.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold truncate">{product.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{TYPE_LABELS[product.type]}</Badge>
                <Badge variant={product.is_published ? "success" : "outline"} className="text-xs">
                  {product.is_published ? "Live" : "Draft"}
                </Badge>
              </div>
            </div>
            <p className="text-lg font-bold text-primary shrink-0">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              disabled={isPending}
              className="flex-1"
            >
              {product.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {product.is_published ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="outline" size="icon" className="shrink-0" asChild>
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
