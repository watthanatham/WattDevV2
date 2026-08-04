"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type PostFormState = { error?: string } | undefined;

async function uniqueSlug(base: string, ignoreId?: number) {
  const slugBase = slugify(base) || `post-${Date.now()}`;
  let slug = slugBase;
  let n = 1;

  while (
    await prisma.post.findFirst({
      where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${slugBase}-${n}`;
  }

  return slug;
}

async function uploadCoverImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media";
  const ext = file.name.split(".").pop();
  const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw new Error(`อัปโหลดรูปไม่สำเร็จ: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await verifySession();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const category = String(formData.get("category") ?? "IT");
  const published = formData.get("published") === "on";
  const photo = formData.get("photo") as File | null;

  if (!title || !body) {
    return { error: "กรุณากรอกชื่อเรื่องและเนื้อหา" };
  }

  let coverImage: string | null = null;
  try {
    if (photo) coverImage = await uploadCoverImage(photo);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดรูปไม่สำเร็จ" };
  }

  const slug = await uniqueSlug(title);

  await prisma.post.create({
    data: { title, slug, body, category, published, coverImage },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(
  id: number,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await verifySession();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const category = String(formData.get("category") ?? "IT");
  const published = formData.get("published") === "on";
  const photo = formData.get("photo") as File | null;

  if (!title || !body) {
    return { error: "กรุณากรอกชื่อเรื่องและเนื้อหา" };
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "ไม่พบบทความนี้" };

  let coverImage = existing.coverImage;
  try {
    if (photo && photo.size > 0) {
      coverImage = await uploadCoverImage(photo);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดรูปไม่สำเร็จ" };
  }

  const slug =
    title === existing.title ? existing.slug : await uniqueSlug(title, id);

  await prisma.post.update({
    where: { id },
    data: { title, slug, body, category, published, coverImage },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await verifySession();
  const id = Number(formData.get("id"));
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}
