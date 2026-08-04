"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/portfolio";

type Profile = {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  tagline: string | null;
  location: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
  penName: string | null;
  penBio: string | null;
  penAvatarUrl: string | null;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800";

export function ProfileForm({ initial }: { initial: Profile | null }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ชื่อ">
          <input
            type="text"
            name="name"
            required
            defaultValue={initial?.name}
            className={inputClass}
          />
        </Field>
        <Field label="ตำแหน่ง (CLASS)">
          <input
            type="text"
            name="role"
            required
            defaultValue={initial?.role}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Tagline"
        hint="ประโยคเดียวสั้นๆ แสดงใต้ชื่อบนการ์ดหลัก"
      >
        <input
          type="text"
          name="tagline"
          defaultValue={initial?.tagline ?? ""}
          placeholder="เช่น สร้างเว็บที่เร็วและใช้งานง่าย ด้วย React และ Node.js"
          className={inputClass}
        />
      </Field>

      <Field label="Bio" hint="เล่าตัวตนแบบยาวขึ้น แสดงในส่วน ABOUT">
        <textarea
          name="bio"
          required
          rows={5}
          defaultValue={initial?.bio}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ที่อยู่">
          <input
            type="text"
            name="location"
            defaultValue={initial?.location ?? ""}
            placeholder="เช่น Bangkok, Thailand"
            className={inputClass}
          />
        </Field>
        <Field label="อีเมล">
          <input
            type="email"
            name="email"
            defaultValue={initial?.email ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="GitHub URL">
          <input
            type="url"
            name="github"
            defaultValue={initial?.github ?? ""}
            placeholder="https://github.com/username"
            className={inputClass}
          />
        </Field>
        <Field label="LinkedIn URL">
          <input
            type="url"
            name="linkedin"
            defaultValue={initial?.linkedin ?? ""}
            placeholder="https://linkedin.com/in/username"
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="เรซูเม่ (PDF)"
        hint={
          initial?.resumeUrl
            ? "อัปโหลดไฟล์ใหม่เพื่อแทนที่ไฟล์เดิม"
            : "ปุ่ม RESUME บนหน้าแรกจะแสดงก็ต่อเมื่ออัปโหลดไฟล์แล้ว"
        }
      >
        {initial?.resumeUrl && (
          <a
            href={initial.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1.5 block text-sm text-indigo-500 hover:text-indigo-400"
          >
            ดูไฟล์ปัจจุบัน →
          </a>
        )}
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          className="w-full text-sm"
        />
      </Field>

      <Field
        label={`รูปโปรไฟล์${initial?.avatarUrl ? " (อัปโหลดใหม่เพื่อแทนที่)" : ""}`}
      >
        <input type="file" name="avatar" accept="image/*" className="w-full text-sm" />
      </Field>

      {/* Blog author identity */}
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm font-semibold">นามปากกา (สำหรับ Blog)</p>
        <p className="mt-1 mb-4 text-xs text-zinc-500">
          ชื่อ + bio + รูป ที่จะแสดงเป็นผู้เขียนในหน้า Blog (ถ้าเว้นว่าง จะใช้ชื่อจริง)
        </p>
        <div className="space-y-4">
          <Field label="ชื่อนามปากกา">
            <input
              type="text"
              name="penName"
              defaultValue={initial?.penName ?? ""}
              placeholder="เช่น WATT.STUDIO"
              className={inputClass}
            />
          </Field>
          <Field label="Bio นามปากกา" hint="แสดงใต้ชื่อบนหน้า Journal">
            <textarea
              name="penBio"
              rows={2}
              defaultValue={initial?.penBio ?? ""}
              placeholder="Street, portrait & fashion photography."
              className={inputClass}
            />
          </Field>
          <Field
            label={`รูปนามปากกา${initial?.penAvatarUrl ? " (อัปโหลดใหม่เพื่อแทนที่)" : ""}`}
          >
            <input
              type="file"
              name="penAvatar"
              accept="image/*"
              className="w-full text-sm"
            />
          </Field>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-500">บันทึกข้อมูลแล้ว</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
      >
        {pending ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-zinc-500">{hint}</p>}
      {children}
    </div>
  );
}
