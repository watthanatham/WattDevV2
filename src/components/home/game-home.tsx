"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/pixel/panel";
import { Hero } from "@/components/sections/hero";
import { WorkExperience } from "@/components/sections/work-experience";
import { Stats } from "@/components/sections/stats";
import { Projects } from "@/components/sections/projects";
import { BossBattles } from "@/components/sections/boss-battles";
import type { HomeData } from "./types";

export function GameHome({
  profile,
  skills,
  projects,
  experiences,
  caseStudies,
  latestPosts,
  years,
}: HomeData) {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-5 py-10 sm:py-14">
      <Hero
        profile={profile}
        years={years}
        questCount={experiences.filter((e) => e.type !== "EDUCATION").length}
        projectCount={projects.length}
      />

      {profile?.bio && (
        <section>
          <SectionTitle accent="text-xp">ABOUT</SectionTitle>
          <div className="pixel-panel p-6">
            <p className="whitespace-pre-line text-sm leading-loose">
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      <WorkExperience experiences={experiences} />

      <Stats skills={skills} />

      <BossBattles battles={caseStudies} />

      <Projects projects={projects} />

      {latestPosts.length > 0 && (
        <section>
          <SectionTitle accent="text-hp">BLOG</SectionTitle>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="pixel-panel-sm flex items-center gap-4 p-4 transition-transform hover:translate-x-1"
              >
                <span className="font-pixel text-[10px] text-magic">▸</span>
                <span className="flex-1 text-sm font-medium">{post.title}</span>
                <span className="font-pixel hidden text-[8px] text-muted sm:block">
                  {new Date(post.createdAt).toLocaleDateString("th-TH")}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="font-pixel mt-4 inline-block text-[9px] text-mp hover:text-magic"
          >
            ALL POSTS →
          </Link>
        </section>
      )}

      {(profile?.email || profile?.github || profile?.linkedin) && (
        <section>
          <SectionTitle accent="text-magic">CONTACT</SectionTitle>
          <div className="pixel-panel p-6">
            <p className="font-pixel mb-5 text-[10px] leading-relaxed">
              READY TO TEAM UP?
              <span className="blink ml-1">_</span>
            </p>
            <div className="space-y-2.5">
              {profile?.email && (
                <ContactRow
                  label="EMAIL"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                />
              )}
              {profile?.github && (
                <ContactRow
                  label="GITHUB"
                  value={profile.github.replace(/^https?:\/\//, "")}
                  href={profile.github}
                />
              )}
              {profile?.linkedin && (
                <ContactRow
                  label="LINKEDIN"
                  value={profile.linkedin.replace(/^https?:\/\//, "")}
                  href={profile.linkedin}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm hover:text-magic"
    >
      <span className="font-pixel w-20 shrink-0 text-[8px] text-muted">
        {label}
      </span>
      <span className="break-all">{value}</span>
    </a>
  );
}
