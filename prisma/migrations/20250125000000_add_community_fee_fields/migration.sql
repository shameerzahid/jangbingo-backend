-- Add community fee fields to job_post table
ALTER TABLE "job_post" ADD COLUMN "communityWorkFee" DECIMAL(65,30);
ALTER TABLE "job_post" ADD COLUMN "communitySupportFee" DECIMAL(65,30);
