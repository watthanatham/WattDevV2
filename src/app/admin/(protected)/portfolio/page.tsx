import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/profile-form";
import { SkillsManager } from "@/components/admin/skills-manager";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectsList } from "@/components/admin/projects-list";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function AdminPortfolioPage() {
  const [profile, skills, projects, experiences] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold">จัดการ Portfolio</h1>

      <section>
        <h2 className="mb-1 text-lg font-semibold">โปรไฟล์</h2>
        <p className="mb-4 text-sm text-zinc-500">
          ข้อมูลส่วนตัวและช่องทางติดต่อ แสดงบนการ์ดหลักของหน้าแรก
        </p>
        <ProfileForm initial={profile} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">
          ประสบการณ์ทำงาน (Work Experience)
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          ส่วนสำคัญที่สุดสำหรับการหางาน — เน้นผลงานที่วัดผลเป็นตัวเลขได้
        </p>
        <ExperienceManager experiences={experiences} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Skills (Stats)</h2>
        <p className="mb-4 text-sm text-zinc-500">
          ระดับ 0-100 จะแสดงเป็นหลอดพลังแบบเกม จัดกลุ่มตามหมวดหมู่
        </p>
        <SkillsManager skills={skills} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Projects</h2>
        <p className="mb-4 text-sm text-zinc-500">
          ผลงาน — กรอกส่วน Boss Battle เพิ่มได้เพื่อโชว์การแก้ปัญหา
        </p>
        <div className="mb-4">
          <ProjectsList projects={projects} />
        </div>
        <ProjectForm />
      </section>
    </div>
  );
}
