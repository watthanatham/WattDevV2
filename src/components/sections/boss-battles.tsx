import { SectionTitle } from "@/components/pixel/panel";

type BossBattle = {
  id: number;
  title: string;
  problem: string;
  solution: string;
  result: string;
};

/**
 * The differentiator section: instead of listing what was built, each card
 * shows a hard problem, how it was attacked, and the measured outcome.
 */
export function BossBattles({ battles }: { battles: BossBattle[] }) {
  if (battles.length === 0) return null;

  return (
    <section>
      <SectionTitle accent="text-dmg">BOSS BATTLES</SectionTitle>
      <p className="mb-6 -mt-3 text-sm text-muted">
        ปัญหายากที่เคยเจอ และวิธีที่แก้มัน
      </p>

      <div className="space-y-5">
        {battles.map((battle) => (
          <article key={battle.id} className="pixel-panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-pixel bg-dmg px-2 py-1 text-[8px] text-white">
                BOSS
              </span>
              <h3 className="font-pixel text-[11px] leading-relaxed">
                {battle.title}
              </h3>
            </div>

            <dl className="space-y-3">
              <Row icon="⚠" label="PROBLEM" accent="text-dmg">
                {battle.problem}
              </Row>
              <Row icon="⚔" label="STRATEGY" accent="text-mp">
                {battle.solution}
              </Row>
              <Row icon="🏆" label="REWARD" accent="text-xp">
                {battle.result}
              </Row>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  accent,
  children,
}: {
  icon: string;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-[3px] border-panel-border/30 pl-3">
      <dt className={`font-pixel mb-1 text-[8px] ${accent}`}>
        {icon} {label}
      </dt>
      <dd className="text-sm leading-relaxed">{children}</dd>
    </div>
  );
}
