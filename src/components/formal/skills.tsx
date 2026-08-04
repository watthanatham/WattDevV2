import type { HomeSkill } from "@/components/home/types";

const CATEGORY_LABEL: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  database: "Database",
  tools: "Tools",
  other: "Other",
};

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "tools",
  "other",
];

export function FormalSkills({ skills }: { skills: HomeSkill[] }) {
  if (skills.length === 0) return null;

  const grouped = new Map<string, HomeSkill[]>();
  for (const skill of skills) {
    const key = skill.category || "other";
    grouped.set(key, [...(grouped.get(key) ?? []), skill]);
  }
  const categories = CATEGORY_ORDER.filter((c) => grouped.has(c));

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight">Skills</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {CATEGORY_LABEL[category]}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped.get(category)!.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 py-1 pl-1.5 pr-3 text-sm dark:border-zinc-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.iconUrl}
                    alt=""
                    className="size-5 object-contain"
                  />
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
