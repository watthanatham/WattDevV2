"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type ExperienceState = { error?: string; success?: boolean } | undefined;

const VALID_TYPES = ["WORK", "FREELANCE", "EDUCATION"];

/** `<input type="month">` gives "YYYY-MM"; anchor it to the 1st of the month. */
function parseMonth(value: string): Date | null {
  if (!/^\d{4}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}-01T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readForm(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const highlights = String(formData.get("highlights") ?? "").trim();
  const tech = String(formData.get("tech") ?? "").trim();
  const rawType = String(formData.get("type") ?? "WORK");
  const type = VALID_TYPES.includes(rawType) ? rawType : "WORK";
  const isCurrent = formData.get("isCurrent") === "on";

  const startDate = parseMonth(String(formData.get("startDate") ?? ""));
  const endDate = isCurrent
    ? null
    : parseMonth(String(formData.get("endDate") ?? ""));

  return {
    company,
    role,
    summary,
    highlights,
    tech,
    type,
    startDate,
    endDate,
    isCurrent,
  };
}

function validate(data: ReturnType<typeof readForm>): string | null {
  if (!data.company || !data.role) {
    return "กรุณากรอกบริษัทและตำแหน่ง";
  }
  // A role described purely as a bullet list is fine — only require that at
  // least one of the two description fields has content.
  if (!data.summary && !data.highlights) {
    return "กรุณากรอกสรุป หรือผลงานเด่น อย่างน้อยหนึ่งอย่าง";
  }
  if (!data.startDate) {
    return "กรุณาระบุเดือน/ปีที่เริ่มงาน";
  }
  if (!data.isCurrent && !data.endDate) {
    return "กรุณาระบุเดือน/ปีที่สิ้นสุด หรือติ๊ก 'ทำอยู่ปัจจุบัน'";
  }
  if (data.endDate && data.endDate < data.startDate) {
    return "วันที่สิ้นสุดต้องอยู่หลังวันที่เริ่ม";
  }
  return null;
}

export async function addExperience(
  _prevState: ExperienceState,
  formData: FormData
): Promise<ExperienceState> {
  await verifySession();

  const data = readForm(formData);
  const error = validate(data);
  if (error) return { error };

  await prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      summary: data.summary,
      highlights: data.highlights,
      tech: data.tech,
      type: data.type,
      startDate: data.startDate!,
      endDate: data.endDate,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function updateExperience(
  id: number,
  _prevState: ExperienceState,
  formData: FormData
): Promise<ExperienceState> {
  await verifySession();

  const data = readForm(formData);
  const error = validate(data);
  if (error) return { error };

  await prisma.experience.update({
    where: { id },
    data: {
      company: data.company,
      role: data.role,
      summary: data.summary,
      highlights: data.highlights,
      tech: data.tech,
      type: data.type,
      startDate: data.startDate!,
      endDate: data.endDate,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function deleteExperience(formData: FormData) {
  await verifySession();
  const id = Number(formData.get("id"));
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}
