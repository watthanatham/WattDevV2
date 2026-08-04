import Image from "next/image";
import { SectionTitle } from "@/components/pixel/panel";

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
};

export function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section>
      <SectionTitle accent="text-mp">PROJECTS</SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="pixel-panel flex flex-col overflow-hidden"
          >
            {project.imageUrl && (
              <div className="relative h-36 w-full border-b-[3px] border-panel-border">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-pixel text-[11px] leading-relaxed">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-pixel mt-4 inline-block text-[9px] text-mp hover:text-magic"
                >
                  VIEW →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
