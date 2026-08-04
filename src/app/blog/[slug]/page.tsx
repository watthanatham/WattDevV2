import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleBody } from "@/components/blog/article-body";
import { categoryLabel, readingTimeMinutes } from "@/lib/blog";
import { sanitizePostHtml } from "@/lib/sanitize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, published: true } });
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImage
      ? { images: [{ url: post.coverImage }] }
      : undefined,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({ where: { slug, published: true } });
  if (!post) notFound();

  const [profile, related] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: 1 },
      select: { penName: true, penAvatarUrl: true, name: true },
    }),
    prisma.post.findMany({
      where: {
        published: true,
        id: { not: post.id },
        category: post.category,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const author = profile?.penName || profile?.name || "Anonymous";
  const readMins = readingTimeMinutes(post.body);
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  return (
    <article>
      {/* Header */}
      <header className="mx-auto max-w-2xl px-6 pt-12 text-center sm:pt-16">
        <Link
          href={`/blog?cat=${post.category}`}
          className="text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {categoryLabel(post.category)}
        </Link>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-zinc-500">{post.excerpt}</p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            {profile?.penAvatarUrl ? (
              <Image
                src={profile.penAvatarUrl}
                alt={author}
                width={28}
                height={28}
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {author[0]}
              </span>
            )}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {author}
            </span>
          </span>
          <span aria-hidden>·</span>
          <span>{date}</span>
          <span aria-hidden>·</span>
          <span>{readMins} min read</span>
        </div>
      </header>

      {/* Hero cover */}
      {post.coverImage && (
        <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-4xl overflow-hidden sm:rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Body */}
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <ArticleBody html={sanitizePostHtml(post.body)} />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-zinc-100 pt-8 dark:border-zinc-900">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-500 dark:bg-zinc-900"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-900">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-zinc-400">
              More in {categoryLabel(post.category)}
            </h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    {r.coverImage && (
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug tracking-tight transition group-hover:text-zinc-500">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
