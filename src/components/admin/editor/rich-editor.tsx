"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { useRef, useState } from "react";
import { BlogImage } from "./image-extension";
import { ImageGallery, type GalleryImage } from "./gallery-extension";
import { uploadEditorImage } from "@/lib/actions/upload";

async function uploadOne(file: File): Promise<GalleryImage | null> {
  if (!file.type.startsWith("image/")) return null;
  const fd = new FormData();
  fd.append("file", file);
  const res = await uploadEditorImage(fd);
  if ("error" in res) {
    alert(res.error);
    return null;
  }
  return { src: res.url, alt: "" };
}

export function RichEditor({
  initialHTML,
  name,
}: {
  initialHTML: string;
  /** Hidden input name that carries the serialized HTML to the server action. */
  name: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(initialHTML);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      BlogImage,
      ImageGallery,
      Placeholder.configure({ placeholder: "เขียนเรื่องราวของคุณ…" }),
    ],
    content: initialHTML || "",
    editorProps: {
      attributes: { class: "editor-body focus:outline-none" },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(
          (event as DragEvent).dataTransfer?.files ?? []
        ).filter((f) => f.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  async function handleFiles(files: File[]) {
    if (!editor) return;
    setUploading(true);
    try {
      const uploaded = (await Promise.all(files.map(uploadOne))).filter(
        (im): im is GalleryImage => im !== null
      );
      if (uploaded.length === 0) return;

      if (uploaded.length === 1) {
        // Single image: normal image block, ask for an optional caption.
        const caption = window.prompt("คำบรรยายรูป (ไม่บังคับ)") ?? "";
        editor
          .chain()
          .focus()
          .setImage({ src: uploaded[0].src, alt: caption })
          .run();
      } else {
        // Multiple images: a gallery grid.
        editor
          .chain()
          .focus()
          .insertContent({ type: "imageGallery", attrs: { images: uploaded } })
          .run();
      }
    } finally {
      setUploading(false);
    }
  }

  if (!editor) {
    return (
      <div className="h-64 animate-pulse rounded-lg border border-zinc-300 dark:border-zinc-700" />
    );
  }

  const imageSelected = editor.isActive("image");

  return (
    <div>
      {/* Hidden field submitted with the form */}
      <input type="hidden" name={name} value={html} />

      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-lg border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-900">
        <TB
          on={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </TB>
        <TB
          on={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </TB>
        <Divider />
        <TB
          on={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </TB>
        <TB
          on={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </TB>
        <TB
          on={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </TB>
        <TB
          on={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </TB>
        <TB
          on={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo; Quote
        </TB>
        <Divider />
        <TB on={false} onClick={() => fileInputRef.current?.click()}>
          {uploading ? "กำลังอัปโหลด…" : "🖼 รูป"}
        </TB>

        {/* Image controls (only when an image is selected) */}
        {imageSelected && (
          <>
            <Divider />
            <span className="px-1 text-xs text-zinc-400">รูป:</span>
            {(["normal", "wide", "full"] as const).map((w) => (
              <TB
                key={w}
                on={editor.isActive("image", { width: w })}
                onClick={() =>
                  editor.chain().focus().updateAttributes("image", { width: w }).run()
                }
              >
                {w === "normal" ? "ปกติ" : w === "wide" ? "กว้าง" : "เต็ม"}
              </TB>
            ))}
            <TB
              on={false}
              onClick={() => {
                const alt =
                  window.prompt(
                    "คำบรรยายรูป",
                    (editor.getAttributes("image").alt as string) ?? ""
                  ) ?? "";
                editor.chain().focus().updateAttributes("image", { alt }).run();
              }}
            >
              คำบรรยาย
            </TB>
            <TB
              on={false}
              onClick={() => editor.chain().focus().deleteSelection().run()}
            >
              ลบ
            </TB>
          </>
        )}
      </div>

      {/* Editor surface */}
      <div className="relative rounded-b-lg border border-t-0 border-zinc-300 dark:border-zinc-700">
        <DragHandle editor={editor}>
          <div className="mr-1 cursor-grab select-none px-1 text-zinc-300 hover:text-zinc-500">
            ⠿
          </div>
        </DragHandle>
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void handleFiles(files);
          e.target.value = "";
        }}
      />

      <p className="mt-1.5 text-xs text-zinc-500">
        ลากรูปมาวาง / วาง (paste) / กดปุ่ม 🖼 เพื่อเพิ่มรูป · เลือกหลายรูปพร้อมกัน =
        แกลเลอรี · ลากที่จับ ⠿ ด้านซ้ายเพื่อสลับตำแหน่งบล็อก
      </p>
    </div>
  );
}

function TB({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm transition ${
        on
          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />;
}
