import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/markdown-content";

const CATEGORY_LABEL: Record<string, string> = {
  IT: "TECH",
  PTG: "PHOTO",
  LS: "LIFE",
};

const CATEGORY_COLOR: Record<string, string> = {
  IT: "bg-mp text-white",
  PTG: "bg-magic text-white",
  LS: "bg-hp text-[#0a2412]",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, published: true } });
  return { title: post?.title ?? "บทความ" };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, published: true } });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link
        href="/blog"
        className="font-pixel inline-block text-[9px] text-mp hover:text-magic"
      >
        ← BACK TO BLOG
      </Link>

      <article className="pixel-panel mt-5 p-6 sm:p-8">
        <span
          className={`font-pixel inline-block px-2 py-1 text-[8px] ${
            CATEGORY_COLOR[post.category] ?? "bg-muted text-white"
          }`}
        >
          {CATEGORY_LABEL[post.category] ?? post.category}
        </span>

        <h1 className="font-pixel mt-4 text-sm leading-loose sm:text-base">
          {post.title}
        </h1>

        <p className="font-pixel mt-4 text-[8px] text-muted">
          UPDATED{" "}
          {new Date(post.updatedAt).toLocaleDateString("th-TH", {
            dateStyle: "medium",
          })}
        </p>

        {post.coverImage && (
          <div className="relative mt-6 h-56 w-full border-[3px] border-panel-border sm:h-72">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 border-t-[3px] border-panel-border/30 pt-6">
          <MarkdownContent content={post.body} />
        </div>
      </article>
    </div>
  );
}
