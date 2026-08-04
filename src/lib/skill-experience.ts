type ExperienceLite = {
  startDate: Date;
  endDate: Date | null;
  tech: string;
};

export type SkillExperience = {
  years: number;
  roleCount: number;
  current: boolean;
} | null;

/**
 * Derives "years used" for a skill from which Experience.tech fields mention
 * it — no separate relation to maintain, the tech field the admin already
 * fills in per role is the single source of truth.
 */
export function deriveSkillExperience(
  skillName: string,
  experiences: ExperienceLite[]
): SkillExperience {
  const target = skillName.trim().toLowerCase();

  const matches = experiences.filter((exp) =>
    exp.tech
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .includes(target)
  );

  if (matches.length === 0) return null;

  const earliest = matches.reduce(
    (min, e) => (e.startDate < min ? e.startDate : min),
    matches[0].startDate
  );
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const years = Math.max(
    1,
    Math.round((Date.now() - earliest.getTime()) / msPerYear)
  );

  return {
    years,
    roleCount: matches.length,
    current: matches.some((e) => e.endDate === null),
  };
}
