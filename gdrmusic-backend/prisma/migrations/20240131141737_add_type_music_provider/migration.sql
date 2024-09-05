-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('YOUTUBE', 'SOUNDCLOUD');

-- AlterTable
ALTER TABLE "Music" ADD COLUMN     "partner_type" "PartnerType" NOT NULL DEFAULT 'YOUTUBE';
