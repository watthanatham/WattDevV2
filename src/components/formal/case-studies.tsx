import type { HomeCaseStudy } from "@/components/home/types";

export function FormalCaseStudies({
  caseStudies,
}: {
  caseStudies: HomeCaseStudy[];
}) {
  if (caseStudies.length === 0) return null;

  return (
    <section>
      <h2 className="mb-1 text-xl font-bold tracking-tight">Case Studies</h2>
      <p className="mb-6 text-sm text-zinc-500">
        Selected problems and how they were solved.
      </p>

      <div className="space-y-4">
        {caseStudies.map((cs) => (
          <article
            key={cs.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="font-semibold">{cs.title}</h3>

            <dl className="mt-4 space-y-3">
              <Row label="Problem">{cs.problem}</Row>
              <Row label="Approach">{cs.solution}</Row>
              <Row label="Result">{cs.result}</Row>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: string }) {
  return (
    <div className="border-l-2 border-indigo-200 pl-3 dark:border-indigo-900">
      <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-500">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </dd>
    </div>
  );
}
