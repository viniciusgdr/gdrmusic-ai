/*
  Warnings:

  - Added the required column `account_method` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountMethod" AS ENUM ('GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account_method" "AccountMethod" NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "user_id" TEXT NOT NULL;
