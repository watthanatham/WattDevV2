import { SectionTitle } from "@/components/pixel/panel";

type Skill = {
  id: number;
  name: string;
  iconUrl: string;
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

  // Group by category so the panel reads like a character sheet
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
      <SectionTitle accent="text-hp">SKILLS</SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category} className="pixel-panel p-5">
            <p className="font-pixel mb-4 text-[9px] text-muted">
              {CATEGORY_LABEL[category]}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped.get(category)!.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-2 border-2 border-panel-border bg-foreground/5 px-2.5 py-1.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={skill.iconUrl}
                    alt=""
                    className="size-4 object-contain"
                  />
                  <span className="font-pixel text-[9px]">{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
