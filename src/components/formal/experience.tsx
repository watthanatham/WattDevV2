import type { HomeExperience } from "@/components/home/types";

const TYPE_LABEL: Record<string, string> = {
  WORK: "Full-time",
  FREELANCE: "Freelance / Contract",
  EDUCATION: "Education",
};

function formatPeriod(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${fmt(start)} – ${end ? fmt(end) : "Present"}`;
}

export function FormalExperience({
  experiences,
}: {
  experiences: HomeExperience[];
}) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight">
        Work Experience
      </h2>

      {experiences.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No experience added yet — add it in Admin → Portfolio.
        </p>
      ) : (
        <ol className="space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
          {experiences.map((exp) => {
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
                <span
                  className={`absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full ${
                    isCurrent ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold">
                    {exp.role} <span className="text-zinc-500">· {exp.company}</span>
                  </h3>
                  <span className="text-sm text-zinc-500">
                    {formatPeriod(exp.startDate, exp.endDate)}
                  </span>
                </div>

                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-indigo-500">
                  {TYPE_LABEL[exp.type] ?? exp.type}
                </p>

                {exp.summary.trim() && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {exp.summary}
                  </p>
                )}

                {highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-indigo-400">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {techs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {techs.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
