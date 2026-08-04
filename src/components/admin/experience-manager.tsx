"use client";

import { useActionState, useState } from "react";
import {
  addExperience,
  updateExperience,
  deleteExperience,
  type ExperienceState,
} from "@/lib/actions/experience";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

type Experience = {
  id: number;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  highlights: string;
  tech: string;
  type: string;
};

const TYPE_LABEL: Record<string, string> = {
  WORK: "งานประจำ",
  FREELANCE: "Freelance",
  EDUCATION: "การศึกษา/อบรม",
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800";

/** `<input type="month">` expects "YYYY-MM". */
function toMonthValue(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 7) : "";
}

function formatPeriod(exp: Experience) {
  return `${toMonthValue(exp.startDate)} – ${
    exp.endDate ? toMonthValue(exp.endDate) : "ปัจจุบัน"
  }`;
}

export function ExperienceManager({
  experiences,
}: {
  experiences: Experience[];
}) {
  // Bumping the key remounts the add form, clearing both DOM inputs and the
  // internal isCurrent state after a successful submit.
  const [addFormKey, setAddFormKey] = useState(0);

  return (
    <div>
      <div className="mb-6 space-y-3">
        {experiences.map((exp) => (
          <ExperienceRow key={exp.id} experience={exp} />
        ))}

        {experiences.length === 0 && (
          <p className="text-sm text-zinc-500">
            ยังไม่มีประสบการณ์ทำงาน — เพิ่มด้านล่างได้เลย
          </p>
        )}
      </div>

      <AddExperienceForm
        key={addFormKey}
        onAdded={() => setAddFormKey((k) => k + 1)}
      />
    </div>
  );
}

function ExperienceRow({ experience }: { experience: Experience }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditExperienceForm
        experience={experience}
        onDone={() => setEditing(false)}
      />
    );
  }

  const techs = experience.tech
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="min-w-0">
        <p className="font-medium">
          {experience.role}{" "}
          <span className="text-zinc-500">@ {experience.company}</span>
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">
          {TYPE_LABEL[experience.type] ?? experience.type} ·{" "}
          {formatPeriod(experience)}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
          {experience.summary}
        </p>
        {techs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {techs.map((t) => (
              <span
                key={t}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 text-sm">
        <button
          onClick={() => setEditing(true)}
          className="font-medium text-indigo-500 hover:text-indigo-400"
        >
          แก้ไข
        </button>
        <form action={deleteExperience}>
          <input type="hidden" name="id" value={experience.id} />
          <ConfirmSubmitButton
            confirmMessage={`ลบประสบการณ์ "${experience.role} @ ${experience.company}" ใช่หรือไม่?`}
            className="font-medium text-red-500 hover:text-red-400"
          >
            ลบ
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

function EditExperienceForm({
  experience,
  onDone,
}: {
  experience: Experience;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<ExperienceState, FormData>(
    async (prev, formData) => {
      const result = await updateExperience(experience.id, prev, formData);
      if (result?.success) onDone();
      return result;
    },
    undefined
  );

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-2xl border-2 border-indigo-500 p-4 sm:grid-cols-2"
    >
      <p className="sm:col-span-2 text-sm font-semibold">
        แก้ไขประสบการณ์
      </p>

      <ExperienceFields initial={experience} />

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-900"
        >
          {pending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={pending}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold disabled:opacity-60 dark:border-zinc-700"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

function AddExperienceForm({ onAdded }: { onAdded: () => void }) {
  const [state, formAction, pending] = useActionState<ExperienceState, FormData>(
    async (prev, formData) => {
      const result = await addExperience(prev, formData);
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
      <p className="sm:col-span-2 text-sm font-semibold">+ เพิ่มประสบการณ์</p>

      <ExperienceFields />

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2 dark:bg-white dark:text-zinc-900"
      >
        {pending ? "กำลังเพิ่ม..." : "+ เพิ่มประสบการณ์"}
      </button>
    </form>
  );
}

/** Shared field set for both add and edit. */
function ExperienceFields({ initial }: { initial?: Experience }) {
  const [isCurrent, setIsCurrent] = useState(
    initial ? initial.endDate === null : false
  );
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [highlights, setHighlights] = useState(initial?.highlights ?? "");

  const bullets = highlights
    .split("\n")
    .map((h) => h.trim())
    .filter(Boolean);

  const summaryLines = summary
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  /** Pasting a list into the summary box is a common slip — offer to fix it. */
  function moveSummaryToHighlights() {
    setHighlights([highlights, ...summaryLines].filter(Boolean).join("\n"));
    setSummary("");
  }

  return (
    <>
      <input
        type="text"
        name="role"
        placeholder="ตำแหน่ง เช่น Full-stack Developer"
        required
        defaultValue={initial?.role}
        className={inputClass}
      />
      <input
        type="text"
        name="company"
        placeholder="บริษัท"
        required
        defaultValue={initial?.company}
        className={inputClass}
      />

      <select
        name="type"
        defaultValue={initial?.type ?? "WORK"}
        className={inputClass}
      >
        {Object.entries(TYPE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isCurrent"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="size-4"
        />
        ทำอยู่ปัจจุบัน
      </label>

      <label className="text-sm">
        <span className="mb-1 block text-xs text-zinc-500">เริ่มงาน</span>
        <input
          type="month"
          name="startDate"
          required
          defaultValue={toMonthValue(initial?.startDate ?? null)}
          className={inputClass}
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block text-xs text-zinc-500">สิ้นสุด</span>
        <input
          type="month"
          name="endDate"
          disabled={isCurrent}
          defaultValue={toMonthValue(initial?.endDate ?? null)}
          className={`${inputClass} disabled:opacity-40`}
        />
      </label>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">
          สรุปบทบาท{" "}
          <span className="font-normal text-zinc-500">(ไม่บังคับ)</span>
        </label>
        <p className="mb-1.5 text-xs text-zinc-500">
          ข้อความสั้นๆ 1–2 บรรทัด — ถ้าจะใส่เป็นข้อๆ ให้ใช้ช่อง
          &quot;สิ่งที่ทำ / ผลงาน&quot; ด้านล่างแทน
        </p>
        <textarea
          name="summary"
          placeholder="เช่น ดูแลระบบภายในของฝ่ายขาย ตั้งแต่เก็บ requirement จนถึง deploy"
          rows={8}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={`${inputClass} whitespace-pre-line`}
        />

        {summaryLines.length > 1 && (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs dark:bg-amber-950/30">
            <span className="text-amber-700 dark:text-amber-400">
              ดูเหมือนคุณวางข้อความ {summaryLines.length} บรรทัด —
              ย้ายไปเป็น bullet ไหม?
            </span>
            <button
              type="button"
              onClick={moveSummaryToHighlights}
              className="rounded-full bg-amber-600 px-2.5 py-1 font-semibold text-white hover:bg-amber-500"
            >
              ย้ายไปเป็น bullet
            </button>
          </div>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">
          สิ่งที่ทำ / ผลงาน
        </label>
        <p className="mb-1.5 text-xs text-zinc-500">
          บรรทัดละ 1 ข้อ → แสดงเป็น bullet บนเว็บ
          <br />
          เขียนให้วัดผลได้จะดีที่สุด เช่น &quot;ลดเวลาโหลดจาก 5s เหลือ
          1.2s&quot;
        </p>
        <textarea
          name="highlights"
          placeholder={
            "Developed and maintained internal business applications.\nGathered and analyzed user requirements for system enhancements."
          }
          rows={8}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          className={inputClass}
        />

        {bullets.length > 0 && (
          <div className="mt-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
            <p className="mb-2 text-xs font-medium text-zinc-500">
              ตัวอย่างที่จะแสดงบนเว็บ ({bullets.length} ข้อ)
            </p>
            <ul className="space-y-1">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-amber-500">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <input
        type="text"
        name="tech"
        placeholder="เทคโนโลยีที่ใช้ คั่นด้วย , เช่น React, Node.js, PostgreSQL"
        defaultValue={initial?.tech}
        className={`${inputClass} sm:col-span-2`}
      />
    </>
  );
}
