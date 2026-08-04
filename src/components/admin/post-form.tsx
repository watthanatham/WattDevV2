"use client";

import { useActionState } from "react";
import type { PostFormState } from "@/lib/actions/posts";
import { RichEditor } from "@/components/admin/editor/rich-editor";
import { BLOG_CATEGORIES } from "@/lib/blog";

const inputClass =
  "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800";

export function PostForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  initial?: {
    title: string;
    body: string;
    excerpt: string | null;
    category: string;
    tags: string[];
    published: boolean;
    coverImage: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">ชื่อเรื่อง</label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          เกริ่น (excerpt)
        </label>
        <p className="mb-1.5 text-xs text-zinc-500">
          สรุปสั้นๆ 1–2 ประโยค แสดงบนการ์ดหน้า blog และใช้เป็น description
        </p>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">หมวดหมู่</label>
          <select
            name="category"
            defaultValue={initial?.category ?? "Street"}
            className={inputClass}
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? false}
              className="size-4 rounded border-zinc-300"
            />
            เผยแพร่
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">แท็ก</label>
        <p className="mb-1.5 text-xs text-zinc-500">คั่นด้วย , เช่น bangkok, 35mm, bw</p>
        <input
          type="text"
          name="tags"
          defaultValue={initial?.tags.join(", ")}
          placeholder="bangkok, 35mm, bw"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          รูปปก {initial?.coverImage && "(อัปโหลดใหม่เพื่อแทนที่รูปเดิม)"}
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">เนื้อหา</label>
        <RichEditor initialHTML={initial?.body ?? ""} name="body" />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
      >
        {pending ? "กำลังบันทึก..." : submitLabel}
      </button>
    </form>
  );
}
