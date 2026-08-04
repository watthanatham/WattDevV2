const CATEGORY_COLOR: Record<string, string> = {
  frontend: "text-hp",
  backend: "text-mp",
  mobile: "text-magic",
  database: "text-xp",
  tools: "text-dmg",
  other: "text-muted",
};

export function StatBar({
  label,
  level,
  category = "other",
}: {
  label: string;
  level: number;
  category?: string;
}) {
  const clamped = Math.max(0, Math.min(100, level));
  const color = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.other;

  return (
    <div>
      <div className="font-pixel mb-1.5 flex items-baseline justify-between text-[10px]">
        <span>{label}</span>
        <span className={color}>{clamped}</span>
      </div>
      <div className="stat-track">
        <div
          className={`stat-fill ${color}`}
          style={{ width: `${clamped}%` }}
          role="meter"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
