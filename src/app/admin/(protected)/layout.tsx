import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/posts", label: "จัดการบล็อก" },
  { href: "/admin/portfolio", label: "จัดการ Portfolio" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await verifySession();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white p-5 sm:flex sm:flex-col dark:border-zinc-800 dark:bg-zinc-900">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WATT<span className="text-indigo-500">.</span>DEV
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          <p className="mb-2 truncate">{user.email}</p>
          <form action={logout}>
            <button className="font-medium text-red-500 hover:text-red-400">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3 sm:hidden dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold">Admin</span>
          <form action={logout}>
            <button className="text-sm font-medium text-red-500">
              ออกจากระบบ
            </button>
          </form>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-5 py-2 sm:hidden dark:border-zinc-800 dark:bg-zinc-900">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium dark:border-zinc-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
      </div>
    </div>
  );
}
