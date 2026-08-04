import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Blog has its own minimal chrome, deliberately independent of the home page's
 * 8-bit / formal mode toggle. It always renders clean and photo-first.
 */
export default async function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await prisma.profile.findUnique({
    where: { id: 1 },
    select: { penName: true, name: true },
  });
  const author = profile?.penName || profile?.name || "Journal";

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/blog"
            className="text-sm font-semibold tracking-[0.2em] uppercase"
          >
            {author}
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Portfolio
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-zinc-100 py-10 dark:border-zinc-900">
        <p className="text-center text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} {author}
        </p>
      </footer>
    </div>
  );
}
