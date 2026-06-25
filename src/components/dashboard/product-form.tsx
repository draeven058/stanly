"use client";

import { useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUpload } from "@/components/dashboard/file-upload";
import { AIDescriptionWriter } from "@/components/ai/ai-description-writer";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product, ProductType } from "@/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="animate-spin" />}
      Save product
    </Button>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const [isPublished, setIsPublished] = useState(product?.is_published ?? false);
  const [productType, setProductType] = useState<ProductType>(product?.type ?? "digital");
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product ? (product.price / 100).toFixed(2) : "");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const action = product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction] = useActionState(action, {});

  function handleAcceptDescription(text: string) {
    if (descriptionRef.current) {
      const nativeSet = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      )?.set;
      nativeSet?.call(descriptionRef.current, text);
      descriptionRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function handleTypeChange(value: string) {
    setProductType(value as ProductType);
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="is_published" value={String(isPublished)} />

      {state.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {state.success}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Product details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title" name="title" placeholder="My awesome product"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description" name="description"
              placeholder="Describe what buyers will get..."
              rows={5} ref={descriptionRef}
              defaultValue={product?.description ?? ""}
            />
          </div>
          <AIDescriptionWriter
            title={title} type={productType} price={price}
            onAccept={handleAcceptDescription}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pricing & type</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="price" name="price" type="number" step="0.01" min="0"
                  placeholder="9.99" className="pl-7"
                  value={price} onChange={(e) => setPrice(e.target.value)} required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Product type</Label>
              <Select name="type" defaultValue={product?.type ?? "digital"} onValueChange={handleTypeChange}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital download</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="link">Link / redirect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {(productType === "digital" || productType === "course") && product?.id && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Product file</CardTitle>
            <CardDescription>Upload the file buyers receive after purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              mode="product-file" productId={product.id}
              currentUrl={product.file_url}
              label="Upload product file" hint="PDF, ZIP, MP4, MP3 — up to 500 MB"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Publish product</p>
            <p className="text-sm text-muted-foreground">Make this visible on your store</p>
          </div>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
