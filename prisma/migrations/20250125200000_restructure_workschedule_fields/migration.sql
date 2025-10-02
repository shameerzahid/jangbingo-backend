-- Drop columns that are no longer needed
ALTER TABLE "job_post" DROP COLUMN IF EXISTS "period";
ALTER TABLE "job_post" DROP COLUMN IF EXISTS "shift";
ALTER TABLE "job_post" DROP COLUMN IF EXISTS "hours";

-- Make workSchedule required (not null)
ALTER TABLE "job_post" ALTER COLUMN "workSchedule" SET NOT NULL;
