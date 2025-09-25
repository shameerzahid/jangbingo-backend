-- CreateEnum
CREATE TYPE "LadderType" AS ENUM ('MOVING_GOODS', 'ON_SITE');

-- CreateEnum
CREATE TYPE "LoadingUnloadingService" AS ENUM ('NONE', 'LOADING', 'UNLOADING', 'BOTH');

-- CreateEnum
CREATE TYPE "TravelDistance" AS ENUM ('WITHIN_JURISDICTION', 'OUTSIDE_JURISDICTION');

-- AlterTable
ALTER TABLE "job_post" ADD COLUMN "ladderType" "LadderType",
ADD COLUMN "luggageVolume" TEXT,
ADD COLUMN "workFloor" INTEGER,
ADD COLUMN "overallHeight" INTEGER,
ADD COLUMN "ladderWorkDuration" TEXT,
ADD COLUMN "ladderWorkHours" INTEGER,
ADD COLUMN "loadingUnloadingService" "LoadingUnloadingService",
ADD COLUMN "travelDistance" "TravelDistance",
ADD COLUMN "dumpService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "movingFee" DECIMAL(65,30),
ADD COLUMN "onSiteFee" DECIMAL(65,30);
