# WATT.DEV — Portfolio & Blog

Personal portfolio + blog, built with Next.js, Prisma, and Supabase (Auth + Storage + Postgres).
Content (blog posts, profile, skills, projects) is editable in the browser via `/admin` — no code
changes needed to update it.

## Stack

- **Next.js 16** (App Router) + Tailwind CSS v4
- **Prisma 7** — SQLite locally, Postgres (Supabase) in production
- **Supabase** — Auth (admin login) + Storage (uploaded images)
- **react-markdown** — blog posts are written in Markdown

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the public site (portfolio + blog) works immediately with the local
SQLite database (seeded from `prisma/seed.ts`).

The `/admin` section requires Supabase to be configured — see [SETUP.md](./SETUP.md) for the full
walkthrough (creating a free Supabase project, storage bucket, admin user, and deploying to
Vercel).

## Project structure

- `src/app/(site)` — public pages: portfolio home, blog list, blog post detail
- `src/app/admin` — login page + protected admin dashboard (posts & portfolio CRUD)
- `src/lib/actions` — Server Actions for all data mutations
- `src/lib/supabase` — Supabase client helpers (browser, server, proxy/session refresh)
- `prisma/schema.prisma` — data models (Post, Profile, Skill, Project)
- `legacy-django/` — the original Django implementation, kept for reference

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Run pending migrations, then build for production |
| `npm run db:seed` | Seed the database with initial portfolio data |
| `npm run db:migrate` | Create/apply a new Prisma migration |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
