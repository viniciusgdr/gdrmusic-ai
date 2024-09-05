/*
  Warnings:

  - A unique constraint covering the columns `[payload]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_payload_key" ON "Session"("payload");
