import { SectionTitle } from "@/components/pixel/panel";
import { StatBar } from "@/components/pixel/stat-bar";

type Skill = {
  id: number;
  name: string;
  iconUrl: string;
  level: number;
  category: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  mobile: "MOBILE",
  database: "DATABASE",
  tools: "TOOLS",
  other: "OTHER",
};

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "tools",
  "other",
];

export function Stats({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  // Group by category so the stat panel reads like a character sheet
  const grouped = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category || "other";
    const list = grouped.get(key) ?? [];
    list.push(skill);
    grouped.set(key, list);
  }

  const categories = CATEGORY_ORDER.filter((c) => grouped.has(c));

  return (
    <section>
      <SectionTitle accent="text-hp">STATS</SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category} className="pixel-panel p-5">
            <p className="font-pixel mb-4 text-[9px] text-muted">
              {CATEGORY_LABEL[category]}
            </p>
            <div className="space-y-3.5">
              {grouped.get(category)!.map((skill) => (
                <StatBar
                  key={skill.id}
                  label={skill.name}
                  level={skill.level}
                  category={skill.category}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Inventory grid */}
      <div className="pixel-panel mt-5 p-5">
        <p className="font-pixel mb-4 text-[9px] text-muted">INVENTORY</p>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              title={`${skill.name} — LV.${skill.level}`}
              className="group relative flex size-12 items-center justify-center border-2 border-panel-border bg-foreground/5 p-2 transition-transform hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.iconUrl}
                alt={skill.name}
                className="size-full object-contain"
              />
              <span className="font-pixel pointer-events-none absolute -bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap border-2 border-panel-border bg-panel px-1.5 py-1 text-[8px] opacity-0 transition-opacity group-hover:opacity-100">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
