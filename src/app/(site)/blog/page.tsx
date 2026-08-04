import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 6;

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

export const metadata = { title: "บล็อก" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = q?.trim() ?? "";

  const where = {
    published: true,
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <div className="pixel-panel p-6 text-center sm:p-8">
        <h1 className="font-pixel text-base sm:text-xl">
          WATT<span className="text-magic">.</span>BLOG
        </h1>
        <p className="mt-4 text-sm text-muted">
          เรื่องราว ความรู้ และประสบการณ์ที่อยากแชร์
        </p>

        <form className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="SEARCH..."
            className="font-pixel w-full border-[3px] border-panel-border bg-background px-3 py-2.5 text-[10px] focus:border-magic focus:outline-none"
          />
          <button
            type="submit"
            className="pixel-btn shrink-0 bg-magic px-4 py-2.5 text-[10px] text-white"
          >
            GO
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="pixel-panel group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
          >
            {post.coverImage && (
              <div className="relative h-40 w-full border-b-[3px] border-panel-border">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <span
                className={`font-pixel self-start px-2 py-1 text-[8px] ${
                  CATEGORY_COLOR[post.category] ?? "bg-muted text-white"
                }`}
              >
                {CATEGORY_LABEL[post.category] ?? post.category}
              </span>
              <h2 className="font-pixel mt-3 flex-1 text-[11px] leading-relaxed group-hover:text-magic">
                {post.title}
              </h2>
              <p className="font-pixel mt-3 text-[8px] text-muted">
                {new Date(post.createdAt).toLocaleDateString("th-TH", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="pixel-panel col-span-full p-10 text-center">
            <p className="font-pixel text-[10px] leading-relaxed text-muted">
              {search ? "NO RESULTS FOUND" : "NO POSTS YET"}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blog?page=${p}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              className={`font-pixel flex size-10 items-center justify-center border-[3px] border-panel-border text-[10px] ${
                p === page
                  ? "bg-magic text-white"
                  : "bg-panel hover:bg-foreground/10"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
