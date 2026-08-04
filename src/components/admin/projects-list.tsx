import { deleteProject } from "@/lib/actions/portfolio";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export function ProjectsList({
  projects,
}: {
  projects: {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    problem: string | null;
    solution: string | null;
    result: string | null;
  }[];
}) {
  if (projects.length === 0) {
    return <p className="text-sm text-zinc-500">ยังไม่มีโปรเจค</p>;
  }

  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center gap-4 px-4 py-3">
          {project.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.title}
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate font-medium">
              {project.title}
              {project.problem && project.solution && project.result && (
                <span
                  title="แสดงเป็น Boss Battle บนหน้าแรก"
                  className="shrink-0 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-red-500"
                >
                  ⚔️ BOSS
                </span>
              )}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {project.description}
            </p>
          </div>
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <ConfirmSubmitButton
              confirmMessage={`ลบโปรเจค "${project.title}" ใช่หรือไม่?`}
              className="shrink-0 text-sm font-medium text-red-500 hover:text-red-400"
            >
              ลบ
            </ConfirmSubmitButton>
          </form>
        </div>
      ))}
    </div>
  );
}
