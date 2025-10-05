-- DropEnum
DROP TYPE IF EXISTS "WorkDateType";

-- AlterTable
ALTER TABLE "job_post" DROP COLUMN "workDate",
ALTER COLUMN "workDateType" SET DATA TYPE TEXT;
