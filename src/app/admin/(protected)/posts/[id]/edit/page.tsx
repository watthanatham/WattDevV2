import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/lib/actions/posts";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

  if (!post) notFound();

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">แก้ไขบทความ</h1>
      <div className="mt-6">
        <PostForm
          action={boundUpdatePost}
          initial={post}
          submitLabel="บันทึกการแก้ไข"
        />
      </div>
    </div>
  );
}
