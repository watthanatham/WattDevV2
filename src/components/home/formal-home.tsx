"use client";

import Link from "next/link";
import { FormalHero } from "@/components/formal/hero";
import { FormalExperience } from "@/components/formal/experience";
import { FormalSkills } from "@/components/formal/skills";
import { FormalCaseStudies } from "@/components/formal/case-studies";
import { FormalProjects } from "@/components/formal/projects";
import type { HomeData } from "./types";

export function FormalHome({
  profile,
  skills,
  projects,
  experiences,
  caseStudies,
  latestPosts,
  years,
}: HomeData) {
  return (
    <div className="mx-auto max-w-3xl space-y-16 px-5 py-12 sm:py-16">
      <FormalHero profile={profile} years={years} />

      {profile?.bio && (
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">About</h2>
          <p className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
            {profile.bio}
          </p>
        </section>
      )}

      <FormalExperience experiences={experiences} />

      <FormalSkills skills={skills} />

      <FormalCaseStudies caseStudies={caseStudies} />

      <FormalProjects projects={projects} />

      {latestPosts.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            From the blog
          </h2>
          <div className="space-y-2">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-indigo-300 dark:border-zinc-800"
              >
                <span className="text-sm font-medium">{post.title}</span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString("th-TH")}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-4 inline-block text-sm font-medium text-indigo-500 hover:text-indigo-400"
          >
            All posts →
          </Link>
        </section>
      )}

      {(profile?.email || profile?.github || profile?.linkedin) && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold tracking-tight">
            Let&apos;s work together
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Open to full-time and freelance opportunities.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {profile.email}
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
        </section>
      )}
    </div>
  );
}
