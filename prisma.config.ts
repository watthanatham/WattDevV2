import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // The Prisma CLI (migrate/studio) always connects directly, bypassing
  // PgBouncer's transaction-mode pooler — advisory locks used by `migrate`
  // don't work reliably through it. The app itself (src/lib/prisma.ts)
  // reads DATABASE_URL directly and is unaffected by this file.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
