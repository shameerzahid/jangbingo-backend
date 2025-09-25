-- Add community fee settings to community table
ALTER TABLE "community" ADD COLUMN "defaultWorkFee" DECIMAL(65,30) DEFAULT 5;
ALTER TABLE "community" ADD COLUMN "defaultSupportFee" DECIMAL(65,30) DEFAULT 2;
