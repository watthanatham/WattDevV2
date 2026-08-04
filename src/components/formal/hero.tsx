import Image from "next/image";
import type { HomeProfile } from "@/components/home/types";

export function FormalHero({
  profile,
  years,
}: {
  profile: HomeProfile;
  years: number;
}) {
  const name = profile?.name ?? "Your Name";
  const role = profile?.role ?? "Add your role in Admin → Portfolio";

  return (
    <section className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl ring-4 ring-indigo-500/10 sm:size-32">
        {profile?.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={name}
            fill
            sizes="128px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 text-3xl font-bold text-white">
            {name[0]}
          </div>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {name}
        </h1>
        <p className="mt-1.5 text-lg font-medium text-indigo-500">{role}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-zinc-500 sm:justify-start">
          {years > 0 && <span>{years}+ years of experience</span>}
          {profile?.location && <span>📍 {profile.location}</span>}
        </div>

        {profile?.tagline && (
          <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
            {profile.tagline}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get in touch
            </a>
          )}
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700"
            >
              Download Resume
            </a>
          )}
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700"
            >
              GitHub
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
