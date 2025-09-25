-- CreateEnum
CREATE TYPE "JobPostType" AS ENUM ('GLOBAL', 'COMMUNITY', 'DESIGNATED');

-- CreateEnum
CREATE TYPE "JobPostCategory" AS ENUM ('SKY', 'LADDER');

-- CreateTable
CREATE TABLE "job_post" (
    "id" SERIAL NOT NULL,
    "type" "JobPostType" NOT NULL,
    "category" "JobPostCategory" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "communityId" INTEGER,
    "designatedUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_designatedUserId_fkey" FOREIGN KEY ("designatedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

