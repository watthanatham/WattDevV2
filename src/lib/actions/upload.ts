"use server";

import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export type UploadResult = { url: string } | { error: string };

/**
 * Uploads an image chosen inside the blog editor to Supabase Storage and
 * returns its public URL. Called from the client editor on button/drop/paste.
 */
export async function uploadEditorImage(
  formData: FormData
): Promise<UploadResult> {
  await verifySession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "ไม่พบไฟล์" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "อัปโหลดได้เฉพาะไฟล์รูปภาพ" };
  }

  const supabase = await createClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media";
  const ext = file.name.split(".").pop() || "jpg";
  const path = `posts/body/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) return { error: `อัปโหลดไม่สำเร็จ: ${error.message}` };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
