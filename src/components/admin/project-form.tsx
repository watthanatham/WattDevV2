"use client";

import { useActionState, useRef } from "react";
import { addProject, type ActionState } from "@/lib/actions/portfolio";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800";

export function ProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await addProject(prev, formData);
      if (result?.success) formRef.current?.reset();
      return result;
    },
    undefined
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-3 rounded-2xl border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800"
    >
      <p className="sm:col-span-2 text-sm font-semibold">+ เพิ่มโปรเจค</p>

      <input
        type="text"
        name="title"
        placeholder="ชื่อโปรเจค"
        required
        className={inputClass}
      />
      <input
        type="url"
        name="link"
        placeholder="ลิงก์ (ถ้ามี)"
        className={inputClass}
      />
      <textarea
        name="description"
        placeholder="คำอธิบายโปรเจค"
        required
        rows={2}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        className="sm:col-span-2 text-sm"
      />

      <div className="sm:col-span-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <p className="text-sm font-semibold">⚔️ Boss Battle (ไม่บังคับ)</p>
        <p className="mt-1 mb-3 text-xs text-zinc-500">
          กรอกครบทั้ง 3 ช่อง โปรเจคนี้จะแสดงเป็นการ์ด &quot;Boss Battle&quot;
          บนหน้าแรกด้วย — ส่วนนี้ช่วยให้คนจ้างเห็นว่าคุณแก้ปัญหาเป็น
        </p>
        <div className="space-y-2">
          <textarea
            name="problem"
            placeholder="⚠ ปัญหา: เจอปัญหาอะไร? เช่น ระบบค้นหาช้า 8 วินาที"
            rows={2}
            className={`${inputClass} w-full`}
          />
          <textarea
            name="solution"
            placeholder="⚔ วิธีแก้: ทำอะไรไปบ้าง? เช่น เพิ่ม index, แก้ N+1 query"
            rows={2}
            className={`${inputClass} w-full`}
          />
          <textarea
            name="result"
            placeholder="🏆 ผลลัพธ์: วัดผลได้เท่าไหร่? เช่น 8s → 0.3s เร็วขึ้น 26 เท่า"
            rows={2}
            className={`${inputClass} w-full`}
          />
        </div>
      </div>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 justify-self-start rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-900"
      >
        {pending ? "กำลังเพิ่ม..." : "+ เพิ่มโปรเจค"}
      </button>
    </form>
  );
}
