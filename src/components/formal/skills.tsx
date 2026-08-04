import { deriveSkillExperience } from "@/lib/skill-experience";
import type { HomeSkill, HomeExperience } from "@/components/home/types";

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

export function FormalSkills({
  skills,
  experiences,
}: {
  skills: HomeSkill[];
  experiences: HomeExperience[];
}) {
  if (skills.length === 0) return null;

  const grouped = new Map<string, HomeSkill[]>();
  for (const skill of skills) {
    const key = skill.category || "other";
    grouped.set(key, [...(grouped.get(key) ?? []), skill]);
  }
  const categories = CATEGORY_ORDER.filter((c) => grouped.has(c));

  return (
    <section>
      <h2 className="mb-1 text-xl font-bold tracking-tight">Skills</h2>
      <p className="mb-6 text-sm text-zinc-500">
        Duration reflects real project usage, not a self-rating.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {CATEGORY_LABEL[category]}
            </p>
            <ul className="space-y-2">
              {grouped.get(category)!.map((skill) => {
                const exp = deriveSkillExperience(skill.name, experiences);
                return (
                  <li
                    key={skill.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={skill.iconUrl}
                        alt=""
                        className="size-4 object-contain"
                      />
                      {skill.name}
                    </span>
                    {exp && (
                      <span className="whitespace-nowrap text-xs text-zinc-400">
                        {exp.years}+ yr{exp.years > 1 ? "s" : ""}
                        {exp.current ? " · current" : ""}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
