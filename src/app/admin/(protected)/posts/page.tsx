import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">จัดการบล็อก</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
        >
          + เขียนใหม่
        </Link>
      </div>

      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{post.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {post.published ? (
                  <span className="text-emerald-500">เผยแพร่แล้ว</span>
                ) : (
                  <span>ฉบับร่าง</span>
                )}
                {" · "}
                {new Date(post.updatedAt).toLocaleDateString("th-TH")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="font-medium text-indigo-500 hover:text-indigo-400"
              >
                แก้ไข
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <ConfirmSubmitButton
                  confirmMessage={`ลบบทความ "${post.title}" ใช่หรือไม่?`}
                  className="font-medium text-red-500 hover:text-red-400"
                >
                  ลบ
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="px-5 py-10 text-center text-zinc-500">
            ยังไม่มีบทความ
          </p>
        )}
      </div>
    </div>
  );
}
