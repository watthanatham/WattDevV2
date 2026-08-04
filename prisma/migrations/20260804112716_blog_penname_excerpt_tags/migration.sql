-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "category" SET DEFAULT 'Street';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "penAvatarUrl" TEXT,
ADD COLUMN     "penBio" TEXT,
ADD COLUMN     "penName" TEXT;
