-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "created_by" "CreatedBy" NOT NULL DEFAULT 'USER';
