import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [postCount, publishedCount, skillCount, projectCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.project.count(),
    ]);

  const stats = [
    { label: "บทความทั้งหมด", value: postCount },
    { label: "เผยแพร่แล้ว", value: publishedCount },
    { label: "Skills", value: skillCount },
    { label: "Projects", value: projectCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">แดชบอร์ด</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
        >
          + เขียนบทความใหม่
        </Link>
        <Link
          href="/admin/portfolio"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
        >
          แก้ไข Portfolio
        </Link>
      </div>
    </div>
  );
}
