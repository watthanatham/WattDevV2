import { createPost } from "@/lib/actions/posts";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">เขียนบทความใหม่</h1>
      <div className="mt-6">
        <PostForm action={createPost} submitLabel="สร้างบทความ" />
      </div>
    </div>
  );
}
