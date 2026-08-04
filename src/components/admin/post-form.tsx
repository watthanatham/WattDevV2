"use client";

import { useActionState, useState } from "react";
import type { PostFormState } from "@/lib/actions/posts";
import { MarkdownContent } from "@/components/markdown-content";

const CATEGORIES = [
  { value: "IT", label: "Technology" },
  { value: "PTG", label: "Photography" },
  { value: "LS", label: "Life styles" },
];

export function PostForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  initial?: {
    title: string;
    body: string;
    category: string;
    published: boolean;
    coverImage: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [body, setBody] = useState(initial?.body ?? "");
  const [preview, setPreview] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">ชื่อเรื่อง</label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">หมวดหมู่</label>
          <select
            name="category"
            defaultValue={initial?.category ?? "IT"}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          >
            {CATEGORIES.map((c) => (
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
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium">
            เนื้อหา (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-400"
          >
            {preview ? "แก้ไข" : "ดูตัวอย่าง"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-64 rounded-lg border border-zinc-300 px-4 py-3 dark:border-zinc-700">
            <MarkdownContent content={body} />
          </div>
        ) : (
          <textarea
            name="body"
            required
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        )}
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
