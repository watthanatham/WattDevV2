import { SectionTitle } from "@/components/pixel/panel";

type Experience = {
  id: number;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  highlights: string;
  tech: string;
  type: string;
};

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  WORK: { label: "MAIN QUEST", className: "bg-magic text-white" },
  FREELANCE: { label: "SIDE QUEST", className: "bg-xp text-[#2e2205]" },
  EDUCATION: { label: "TRAINING", className: "bg-mp text-white" },
};

function formatPeriod(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "NOW"}`;
}

export function WorkExperience({ experiences }: { experiences: Experience[] }) {
  return (
    <section>
      <SectionTitle accent="text-magic">WORK EXPERIENCE</SectionTitle>

      {experiences.length === 0 ? (
        <div className="pixel-panel p-6 text-center">
          <p className="font-pixel text-[10px] leading-relaxed text-muted">
            NO WORK EXPERIENCE YET
          </p>
          <p className="mt-3 text-sm text-muted">
            เพิ่มประสบการณ์ทำงานได้ที่หน้า Admin → Portfolio
          </p>
        </div>
      ) : (
        <ol className="relative space-y-4 border-l-[3px] border-panel-border pl-6 sm:pl-8">
          {experiences.map((exp) => {
            const badge = TYPE_BADGE[exp.type] ?? TYPE_BADGE.WORK;
            const isCurrent = exp.endDate === null;
            const highlights = exp.highlights
              .split("\n")
              .map((h) => h.trim())
              .filter(Boolean);
            const techs = exp.tech
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <li key={exp.id} className="relative">
                {/* Timeline node */}
                <span
                  className={`absolute -left-[calc(1.5rem+9px)] top-5 size-3 border-2 border-panel-border sm:-left-[calc(2rem+9px)] ${
                    isCurrent ? "bg-hp" : "bg-panel"
                  }`}
                />

                <div className="pixel-panel p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`font-pixel px-2 py-1 text-[8px] ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    {isCurrent && (
                      <span className="font-pixel bg-hp px-2 py-1 text-[8px] text-[#0a2412]">
                        ACTIVE
                      </span>
                    )}
                    <span className="font-pixel ml-auto text-[9px] text-muted">
                      {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  <h3 className="font-pixel text-[11px] leading-relaxed">
                    {exp.role}
                  </h3>
                  <p className="font-pixel mt-1.5 text-[10px] text-mp">
                    @ {exp.company}
                  </p>

                  {exp.summary.trim() && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {exp.summary}
                    </p>
                  )}

                  {highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {highlights.map((h, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-xp">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {techs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {techs.map((t) => (
                        <span
                          key={t}
                          className="font-pixel border-2 border-panel-border/40 px-2 py-1 text-[8px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
