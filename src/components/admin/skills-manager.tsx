"use client";

import { useActionState, useState } from "react";
import {
  addSkill,
  updateSkillIcon,
  deleteSkill,
  type ActionState,
} from "@/lib/actions/portfolio";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

type Skill = {
  id: number;
  name: string;
  iconUrl: string;
  category: string;
};

const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "database", label: "Database" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "อื่นๆ" },
];

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  // Remount the add form after a successful create to clear its inputs.
  const [addKey, setAddKey] = useState(0);

  return (
    <div>
      <div className="mb-6 space-y-2">
        {skills.map((skill) => (
          <SkillRow key={skill.id} skill={skill} />
        ))}

        {skills.length === 0 && (
          <p className="text-sm text-zinc-500">ยังไม่มี skill</p>
        )}
      </div>

      <AddSkillForm key={addKey} onAdded={() => setAddKey((k) => k + 1)} />
    </div>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  const boundUpdate = updateSkillIcon.bind(null, skill.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    boundUpdate,
    undefined
  );

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={skill.iconUrl}
        alt={skill.name}
        className="size-8 shrink-0 object-contain"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{skill.name}</p>
        <p className="text-xs text-zinc-500">
          {CATEGORIES.find((c) => c.value === skill.category)?.label ??
            skill.category}
        </p>
        {state?.error && (
          <p className="text-xs text-red-500">{state.error}</p>
        )}
      </div>

      {/* Replace this skill's icon */}
      <form action={formAction} className="flex items-center gap-2">
        <label className="cursor-pointer text-sm font-medium text-indigo-500 hover:text-indigo-400">
          เปลี่ยนไอคอน
          <input
            type="file"
            name="icon"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
          />
        </label>
        {pending && <span className="text-xs text-zinc-400">กำลังอัปโหลด…</span>}
      </form>

      <form action={deleteSkill}>
        <input type="hidden" name="id" value={skill.id} />
        <ConfirmSubmitButton
          confirmMessage={`ลบ skill "${skill.name}" ใช่หรือไม่?`}
          className="text-sm font-medium text-red-500 hover:text-red-400"
        >
          ลบ
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}

function AddSkillForm({ onAdded }: { onAdded: () => void }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await addSkill(prev, formData);
      if (result?.success) onAdded();
      return result;
    },
    undefined
  );

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-2xl border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800"
    >
      <p className="sm:col-span-2 text-sm font-semibold">+ เพิ่ม Skill</p>
      <input
        type="text"
        name="name"
        placeholder="ชื่อ skill เช่น React"
        required
        className={inputClass}
      />
      <select name="category" defaultValue="frontend" className={inputClass}>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <label className="sm:col-span-2 text-sm">
        <span className="mb-1 block text-xs text-zinc-500">
          ไฟล์ไอคอน (แนะนำ PNG/SVG พื้นหลังโปร่ง)
        </span>
        <input
          type="file"
          name="icon"
          accept="image/*"
          required
          className="w-full text-sm"
        />
      </label>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-zinc-900"
      >
        {pending ? "กำลังเพิ่ม..." : "+ เพิ่ม"}
      </button>
    </form>
  );
}
