import { addSkill, deleteSkill, updateSkillLevel } from "@/lib/actions/portfolio";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

type Skill = {
  id: number;
  name: string;
  iconUrl: string;
  level: number;
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
  return (
    <div>
      <div className="mb-6 space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
          >
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
            </div>

            {/* Inline level tweak */}
            <form action={updateSkillLevel} className="flex items-center gap-2">
              <input type="hidden" name="id" value={skill.id} />
              <input
                type="number"
                name="level"
                min={0}
                max={100}
                defaultValue={skill.level}
                className={`${inputClass} w-20`}
              />
              <button className="text-sm font-medium text-indigo-500 hover:text-indigo-400">
                บันทึก
              </button>
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
        ))}

        {skills.length === 0 && (
          <p className="text-sm text-zinc-500">ยังไม่มี skill</p>
        )}
      </div>

      <form
        action={addSkill}
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
        <input
          type="url"
          name="iconUrl"
          placeholder="URL ไอคอน"
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
        <input
          type="number"
          name="level"
          min={0}
          max={100}
          defaultValue={70}
          placeholder="ระดับ 0-100"
          className={inputClass}
        />
        <button className="justify-self-start rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white sm:col-span-2 dark:bg-white dark:text-zinc-900">
          + เพิ่ม
        </button>
      </form>
    </div>
  );
}
