import Image from "next/image";
import type { HomeProject } from "@/components/home/types";

export function FormalProjects({ projects }: { projects: HomeProject[] }) {
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight">Projects</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            {project.imageUrl && (
              <div className="relative h-40 w-full">
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
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-indigo-500 hover:text-indigo-400"
                >
                  View project →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
