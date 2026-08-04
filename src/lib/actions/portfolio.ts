"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: boolean } | undefined;

async function uploadFile(
  file: File,
  folder: string,
  errorLabel = "อัปโหลดไฟล์ไม่สำเร็จ"
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media";
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw new Error(`${errorLabel}: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await verifySession();

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatar = formData.get("avatar") as File | null;
  const resume = formData.get("resume") as File | null;

  const optional = (key: string) =>
    String(formData.get(key) ?? "").trim() || null;

  const tagline = optional("tagline");
  const location = optional("location");
  const email = optional("email");
  const github = optional("github");
  const linkedin = optional("linkedin");

  if (!name || !role || !bio) {
    return { error: "กรุณากรอกข้อมูลให้ครบ" };
  }

  if (resume && resume.size > 0 && resume.type !== "application/pdf") {
    return { error: "ไฟล์เรซูเม่ต้องเป็น PDF เท่านั้น" };
  }

  let avatarUrl: string | undefined;
  let resumeUrl: string | undefined;
  try {
    if (avatar && avatar.size > 0) {
      avatarUrl = (await uploadFile(avatar, "profile", "อัปโหลดรูปไม่สำเร็จ")) ?? undefined;
    }
    if (resume && resume.size > 0) {
      resumeUrl = (await uploadFile(resume, "resume", "อัปโหลดเรซูเม่ไม่สำเร็จ")) ?? undefined;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดไฟล์ไม่สำเร็จ" };
  }

  const fields = { name, role, bio, tagline, location, email, github, linkedin };

  await prisma.profile.upsert({
    where: { id: 1 },
    create: { id: 1, ...fields, avatarUrl, resumeUrl },
    update: {
      ...fields,
      ...(avatarUrl ? { avatarUrl } : {}),
      ...(resumeUrl ? { resumeUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function addSkill(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await verifySession();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "other").trim();
  const icon = formData.get("icon") as File | null;

  if (!name) return { error: "กรุณากรอกชื่อ skill" };
  if (!icon || icon.size === 0) return { error: "กรุณาเลือกไฟล์ไอคอน" };

  let iconUrl: string | null = null;
  try {
    iconUrl = await uploadFile(icon, "skills", "อัปโหลดไอคอนไม่สำเร็จ");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดไอคอนไม่สำเร็จ" };
  }
  if (!iconUrl) return { error: "อัปโหลดไอคอนไม่สำเร็จ" };

  const last = await prisma.skill.findFirst({ orderBy: { order: "desc" } });
  await prisma.skill.create({
    data: { name, iconUrl, category, order: (last?.order ?? 0) + 1 },
  });

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

/** Replace an existing skill's icon by uploading a new file. */
export async function updateSkillIcon(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await verifySession();
  const icon = formData.get("icon") as File | null;
  if (!icon || icon.size === 0) return { error: "กรุณาเลือกไฟล์ไอคอน" };

  let iconUrl: string | null = null;
  try {
    iconUrl = await uploadFile(icon, "skills", "อัปโหลดไอคอนไม่สำเร็จ");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดไอคอนไม่สำเร็จ" };
  }
  if (!iconUrl) return { error: "อัปโหลดไอคอนไม่สำเร็จ" };

  await prisma.skill.update({ where: { id }, data: { iconUrl } });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function deleteSkill(formData: FormData) {
  await verifySession();
  const id = Number(formData.get("id"));
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}

export async function addProject(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await verifySession();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim() || null;
  const problem = String(formData.get("problem") ?? "").trim() || null;
  const solution = String(formData.get("solution") ?? "").trim() || null;
  const result = String(formData.get("result") ?? "").trim() || null;
  const image = formData.get("image") as File | null;

  if (!title || !description) {
    return { error: "กรุณากรอกชื่อและคำอธิบายโปรเจค" };
  }

  let imageUrl: string | null = null;
  try {
    if (image) imageUrl = await uploadFile(image, "projects", "อัปโหลดรูปไม่สำเร็จ");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อัปโหลดรูปไม่สำเร็จ" };
  }

  const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });
  await prisma.project.create({
    data: {
      title,
      description,
      link,
      imageUrl,
      problem,
      solution,
      result,
      order: (last?.order ?? 0) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function deleteProject(formData: FormData) {
  await verifySession();
  const id = Number(formData.get("id"));
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}
