-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SIGNATURE', 'DIRECT_PAYMENT', 'CASH');

-- CreateEnum
CREATE TYPE "WorkDateType" AS ENUM ('URGENT', 'TODAY', 'TOMORROW', 'CUSTOM_DATE');

-- AlterTable
ALTER TABLE "job_post" ADD COLUMN     "equipmentType" TEXT,
ADD COLUMN     "equipmentLength" INTEGER,
ADD COLUMN     "workDateType" "WorkDateType",
ADD COLUMN     "workDate" TIMESTAMP(3),
ADD COLUMN     "arrivalTime" TEXT,
ADD COLUMN     "workSchedule" TEXT,
ADD COLUMN     "customHours" INTEGER,
ADD COLUMN     "basePrice" DECIMAL(10,2),
ADD COLUMN     "finalPrice" DECIMAL(10,2),
ADD COLUMN     "isNightWork" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceAdjustment" INTEGER,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "expectedPaymentDate" TEXT,
ADD COLUMN     "withFee" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "totalWorkFee" DECIMAL(10,2),
ADD COLUMN     "unitPriceFee" DECIMAL(10,2),
ADD COLUMN     "siteAddress" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "workContents" TEXT,
ADD COLUMN     "deliveryInfo" TEXT;

