import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, categoryLabel } from "@/lib/blog";

const PAGE_SIZE = 9;

export const metadata = {
  title: "Journal",
  description: "Street, portrait & fashion photography journal.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; cat?: string }>;
}) {
  const { page: pageParam, q, cat } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = q?.trim() ?? "";
  const category = BLOG_CATEGORIES.some((c) => c.value === cat) ? cat! : "";

  const profile = await prisma.profile.findUnique({
    where: { id: 1 },
    select: { penName: true, penBio: true, name: true },
  });

  const where = {
    published: true,
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(category ? { category } : {}),
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
  const author = profile?.penName || profile?.name || "Journal";

  const qs = (params: Record<string, string | number>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("q", search);
    if (category) sp.set("cat", category);
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, String(v));
      else sp.delete(k);
    }
    const s = sp.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      {/* Masthead */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {author}
        </h1>
        {profile?.penBio && (
          <p className="mx-auto mt-3 max-w-xl text-zinc-500">
            {profile.penBio}
          </p>
        )}
      </div>

      {/* Category filter + search */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-1">
          <FilterChip href={qs({ cat: "", page: "" })} active={!category}>
            All
          </FilterChip>
          {BLOG_CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              href={qs({ cat: c.value, page: "" })}
              active={category === c.value}
            >
              {c.label}
            </FilterChip>
          ))}
        </nav>

        <form className="w-full max-w-xs">
          {category && <input type="hidden" name="cat" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search…"
            className="w-full border-b border-zinc-200 bg-transparent px-1 py-2 text-center text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:focus:border-zinc-100"
          />
        </form>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <p className="py-20 text-center text-zinc-400">
          {search || category ? "No posts found." : "No posts yet."}
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-300">
                    <span className="text-sm uppercase tracking-widest">
                      {categoryLabel(post.category)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                  {categoryLabel(post.category)}
                </p>
                <h2 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight transition group-hover:text-zinc-500">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-6 text-sm">
          {page > 1 ? (
            <Link
              href={qs({ page: page - 1 })}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← Newer
            </Link>
          ) : (
            <span className="text-zinc-300 dark:text-zinc-700">← Newer</span>
          )}
          <span className="text-zinc-400">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={qs({ page: page + 1 })}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Older →
            </Link>
          ) : (
            <span className="text-zinc-300 dark:text-zinc-700">Older →</span>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      }`}
    >
      {children}
    </Link>
  );
}
