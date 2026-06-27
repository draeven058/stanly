"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import type { ActionState } from "./auth";

const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(2000).optional(),
  price: z
    .string()
    .transform((v) => Math.round(parseFloat(v) * 100))
    .pipe(z.number().min(0, "Price must be non-negative")),
  type: z.enum(["digital", "course", "membership", "link"]),
  is_published: z.boolean().default(false),
});

export async function getOrCreateStore(userId: string) {
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (store) return store;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { data: newStore, error } = await supabase
    .from("stores")
    .insert({
      user_id: userId,
      name: profile.username,
      slug: profile.username,
      theme_color: "#7c3aed",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newStore;
}

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const result = productSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    type: formData.get("type"),
    is_published: formData.get("is_published") === "true",
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const store = await getOrCreateStore(user.id);

  const slug = slugify(result.data.title);

  const { error } = await supabase.from("products").insert({
    store_id: store.id,
    slug,
    ...result.data,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const result = productSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    type: formData.get("type"),
    is_published: formData.get("is_published") === "true",
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase
    .from("products")
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { success: "Product updated successfully" };
}

export async function toggleProductPublish(
  id: string,
  isPublished: boolean
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("products")
    .update({ is_published: !isPublished, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { success: `Product ${!isPublished ? "published" : "unpublished"}` };
}

export async function deleteProduct(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  return { success: "Product deleted" };
}

export async function uploadProductFile(
  productId: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${productId}/file.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-files")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from("product-files").getPublicUrl(path);

  await supabase
    .from("products")
    .update({ file_url: data.publicUrl })
    .eq("id", productId);

  return { url: data.publicUrl };
}
