-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "tagline" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "problem" TEXT,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "solution" TEXT;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 70;

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "summary" TEXT NOT NULL,
    "highlights" TEXT NOT NULL DEFAULT '',
    "tech" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'WORK',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);
