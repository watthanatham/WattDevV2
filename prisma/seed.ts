import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Seeding writes schema-shaped data, so run it against the direct connection
// when available (the pooler is fine too, but direct avoids pooling limits).
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // avatarUrl/resumeUrl are deliberately excluded here — those are uploaded
  // through the admin UI, and re-running the seed should never clobber them.
  const profileData = {
    name: "Watthanatham Kruram",
    role: "Full-Stack Developer / System Engineer",
    tagline:
      "Building and modernizing internal manufacturing systems end-to-end — from requirements to deployment.",
    bio: "Full-Stack Developer with 3+ years building and modernizing internal manufacturing systems (ASP.NET Core, SQL Server, JavaScript) for a Tool & Die / production environment. Experienced in taking systems from requirement gathering with end users and department stakeholders through to deployment — including a middleware API layer that standardized integration across legacy and new applications. Comfortable owning a project end-to-end: analysis, development, and user support.",
    location: "Pan Thong, Chonburi, Thailand",
    email: "watthanatham.kruram@gmail.com",
    github: "https://github.com/watthanatham",
    linkedin: "https://linkedin.com/in/watthanathamkr",
  };

  await prisma.profile.upsert({
    where: { id: 1 },
    create: { id: 1, ...profileData },
    update: profileData,
  });

  // Skills actually used day-to-day (from CV "Technical Skills"). Levels are
  // only used by the 8-bit stat bars — formal mode derives real proficiency
  // from which Experience.tech fields mention each skill, so keep those two
  // in sync when editing.
  const skills: {
    name: string;
    iconUrl: string;
    category: string;
    level: number;
  }[] = [
    {
      name: "C#",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/C_Sharp_wordmark.svg/2560px-C_Sharp_wordmark.svg.png",
      category: "backend",
      level: 85,
    },
    {
      name: "ASP.NET Core",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/ASP.NET_Core_Logo.svg/512px-ASP.NET_Core_Logo.svg.png",
      category: "backend",
      level: 85,
    },
    {
      name: "MSSQL",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Microsoft_SQL_Server_Logo.svg/2560px-Microsoft_SQL_Server_Logo.svg.png",
      category: "database",
      level: 80,
    },
    {
      name: "JavaScript",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png",
      category: "frontend",
      level: 85,
    },
    {
      name: "GitLab",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GitLab_Logo.svg/2560px-GitLab_Logo.svg.png",
      category: "tools",
      level: 80,
    },
    {
      name: "SQL",
      iconUrl:
        "https://thumbs.dreamstime.com/b/sql-database-icon-logo-design-ui-ux-app-orange-inscription-shadow-96841969.jpg",
      category: "database",
      level: 80,
    },
    {
      name: "Python",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
      category: "backend",
      level: 70,
    },
    {
      name: "Django",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Django_logo.svg/2560px-Django_logo.svg.png",
      category: "backend",
      level: 65,
    },
    {
      name: "Node.js",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png",
      category: "backend",
      level: 70,
    },
    {
      name: "HTML5",
      iconUrl: "https://cdn.worldvectorlogo.com/logos/html-1.svg",
      category: "frontend",
      level: 90,
    },
    {
      name: "CSS",
      iconUrl:
        "https://cdn4.iconfinder.com/data/icons/iconsimple-programming/512/css-512.png",
      category: "frontend",
      level: 85,
    },
    {
      name: "Vue.js",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1184px-Vue.js_Logo_2.svg.png",
      category: "frontend",
      level: 75,
    },
    {
      name: "Bootstrap",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/2560px-Bootstrap_logo.svg.png",
      category: "frontend",
      level: 75,
    },
    {
      name: "PostgreSQL",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/2110px-Postgresql_elephant.svg.png",
      category: "database",
      level: 70,
    },
    {
      name: "Java",
      iconUrl:
        "https://ubiqum.com/assets/uploads/2021/12/learn-java-with-ubiqum-logo.png",
      category: "backend",
      level: 65,
    },
    {
      name: "GitHub",
      iconUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png",
      category: "tools",
      level: 85,
    },
  ];

  await prisma.skill.deleteMany();
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({ data: { ...skills[i], order: i } });
  }

  // tech fields intentionally reuse the exact Skill.name strings above —
  // that overlap is how formal mode derives "years used" per skill.
  const experiences = [
    {
      company: "Thai NOK Co., Ltd.",
      role: "System Engineer",
      type: "WORK",
      startDate: new Date("2023-03-01"),
      endDate: null,
      summary:
        "Full-stack developer building and modernizing internal manufacturing systems for a Tool & Die / production environment — from requirement gathering with stakeholders through to deployment.",
      highlights: [
        "Designed and developed an API Center as a middleware layer for data exchange between legacy and new web applications, standardizing system integration company-wide — first deployed in the Mold Management System.",
        "Enhanced the Mold Management System for the Tool & Die factory, streamlining operational planning and reducing production planning time.",
        "Replaced paper-based machine inspections with QR-code scanning in the E-Machine Checklist system, cutting manual data-entry time and administrative workload.",
        "Built an AI-powered Safety Patrol system that transcribes on-site hazard reports via speech-to-text and auto-fills the correct form fields, replacing manual audio re-typing.",
        "Improved the Health Information system for the Safety department, reducing paper usage by 90%.",
        "Automated daily production summaries and defective item tracking in the E-record system, reducing manual reporting effort.",
        "Rolled out GitLab for source control across the web team, replacing shared file storage and improving code review workflows.",
      ].join("\n"),
      tech: "C#, ASP.NET Core, MSSQL, JavaScript, GitLab, SQL",
    },
    {
      company: "Burapha University",
      role: "Bachelor of Science in Computer Science",
      type: "EDUCATION",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2022-12-01"),
      summary:
        "Computer Science degree with hands-on software engineering coursework.",
      highlights: [
        "Designed and developed a POS system using NetBeans and Java for a software engineering project.",
        "Built the frontend and backend of a Student Tracking System, hand-coding Vue.js and Node.js.",
        "Designed the user interface for a coffee-shop ordering system in a UI/UX design project.",
      ].join("\n"),
      tech: "Java, Vue.js, Node.js",
    },
  ];

  await prisma.experience.deleteMany();
  for (let i = 0; i < experiences.length; i++) {
    await prisma.experience.create({ data: { ...experiences[i], order: i } });
  }

  // Case studies (problem/solution/result) drawn directly from CV bullets —
  // these render as both "Boss Battles" (8-bit) and "Case Studies" (formal).
  const projects = [
    {
      title: "API Center — Middleware Integration Layer",
      description:
        "Centralized ASP.NET Core Web API layer standardizing data exchange between legacy and new internal systems.",
      problem:
        "Legacy and new web applications across the company had no standard way to exchange data, so every new system needed its own custom point-to-point integration.",
      solution:
        "Designed and built an API Center as a middleware layer in ASP.NET Core Web API, first deployed for the Mold Management System.",
      result:
        "Standardized system integration company-wide — new systems plug into one shared API layer instead of one-off integrations.",
      order: 0,
    },
    {
      title: "AI-Powered Safety Patrol System",
      description:
        "On-site hazard logging system for the production line, using AI speech-to-text to remove manual data entry.",
      problem:
        "Safety officers recorded hazard findings as audio in the field, then manually re-typed every recording into the web form back at their desk.",
      solution:
        "Built a speech-to-text pipeline that transcribes the audio, then used AI to parse context from the transcript and auto-fill the correct form fields.",
      result:
        "Removed the manual re-typing step entirely — hazards are logged and the form fills itself on-site.",
      order: 1,
    },
    {
      title: "Health Information System Overhaul",
      description:
        "Digitized treatment usage and medicine distribution tracking for the Safety department.",
      problem:
        "Treatment usage and medicine distribution were tracked on paper, making records slow to search and easy to lose.",
      solution:
        "Built a web system for the Safety department to manage treatment usage and medicine distribution digitally.",
      result: "Reduced paper usage by 90%.",
      order: 2,
    },
    {
      title: "Student Tracking System",
      description:
        "Full-stack student and course information system built during university, hand-coded frontend and backend.",
      link: "https://github.com/watthanatham/student_tracking_system-front-end-",
      order: 3,
    },
    {
      title: "Point of Sale System",
      description:
        "Desktop POS system built with NetBeans and Java for a software engineering coursework project.",
      link: "https://github.com/watthanatham/POS-System-",
      order: 4,
    },
  ];

  await prisma.project.deleteMany();
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
