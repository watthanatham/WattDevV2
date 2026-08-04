import Image from "next/image";
import { PixelLink } from "@/components/pixel/pixel-button";

type Profile = {
  name: string;
  role: string;
  tagline: string | null;
  location: string | null;
  avatarUrl: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
};

export function Hero({
  profile,
  years,
  questCount,
  projectCount,
}: {
  profile: Profile | null;
  years: number;
  questCount: number;
  projectCount: number;
}) {
  const name = profile?.name ?? "YOUR NAME";
  const role = profile?.role ?? "Full-stack Developer";

  return (
    <section className="pixel-panel relative overflow-hidden p-6 sm:p-8">
      {/* Decorative corner pixels */}
      <span className="absolute left-1.5 top-1.5 size-1.5 bg-magic" />
      <span className="absolute right-1.5 top-1.5 size-1.5 bg-hp" />
      <span className="absolute bottom-1.5 left-1.5 size-1.5 bg-xp" />
      <span className="absolute bottom-1.5 right-1.5 size-1.5 bg-mp" />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Avatar */}
        <div className="sprite-bob shrink-0">
          <div className="relative size-28 border-[3px] border-panel-border bg-gradient-to-br from-magic to-mp sm:size-32">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={name}
                fill
                sizes="128px"
                className="object-cover"
                style={{ imageRendering: "pixelated" }}
                priority
              />
            ) : (
              <span className="font-pixel absolute inset-0 flex items-center justify-center text-3xl text-white">
                {name[0]}
              </span>
            )}
          </div>
        </div>

        {/* Name plate */}
        <div className="flex-1 text-center sm:text-left">
          <p className="font-pixel mb-2 text-[9px] text-muted">PLAYER</p>
          <h1 className="font-pixel text-base leading-relaxed sm:text-xl">
            {name}
          </h1>

          <div className="font-pixel mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[9px] sm:justify-start">
            <span className="text-hp">CLASS: {role}</span>
            {years > 0 && <span className="text-xp">LV.{years}</span>}
            {profile?.location && (
              <span className="text-muted">📍 {profile.location}</span>
            )}
          </div>

          {profile?.tagline && (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {profile.tagline}
            </p>
          )}

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center sm:max-w-sm">
            <MiniStat label="EXP" value={years > 0 ? `${years}Y` : "—"} />
            <MiniStat label="QUESTS" value={questCount} />
            <MiniStat label="PROJECTS" value={projectCount} />
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            {profile?.email && (
              <PixelLink href={`mailto:${profile.email}`} external variant="primary">
                ✉ CONTACT
              </PixelLink>
            )}
            {profile?.resumeUrl && (
              <PixelLink href={profile.resumeUrl} external variant="xp">
                ⬇ RESUME
              </PixelLink>
            )}
            {profile?.github && (
              <PixelLink href={profile.github} external variant="ghost">
                GITHUB
              </PixelLink>
            )}
            {profile?.linkedin && (
              <PixelLink href={profile.linkedin} external variant="ghost">
                LINKEDIN
              </PixelLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-2 border-panel-border/40 py-2">
      <p className="font-pixel text-sm">{value}</p>
      <p className="font-pixel mt-1 text-[8px] text-muted">{label}</p>
    </div>
  );
}
