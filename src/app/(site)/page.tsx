import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/home/home-content";
import type { HomeCaseStudy } from "@/components/home/types";

/** Years of experience, derived from the earliest WORK/FREELANCE entry. */
function calcYears(experiences: { startDate: Date; type: string }[]) {
  const professional = experiences.filter((e) => e.type !== "EDUCATION");
  if (professional.length === 0) return 0;

  const earliest = professional.reduce(
    (min, e) => (e.startDate < min ? e.startDate : min),
    professional[0].startDate
  );
  const ms = Date.now() - earliest.getTime();
  return Math.max(1, Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000)));
}

export default async function HomePage() {
  const [profile, skills, projects, experiences, latestPosts] =
    await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: [{ order: "asc" }] }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const years = calcYears(experiences);

  // A project renders as a case study / "Boss Battle" only when the full
  // problem → solution → result story is filled in.
  const caseStudies = projects.filter(
    (p): p is HomeCaseStudy => Boolean(p.problem && p.solution && p.result)
  );

  return (
    <HomeContent
      profile={profile}
      skills={skills}
      projects={projects}
      experiences={experiences}
      caseStudies={caseStudies}
      latestPosts={latestPosts}
      years={years}
    />
  );
}
