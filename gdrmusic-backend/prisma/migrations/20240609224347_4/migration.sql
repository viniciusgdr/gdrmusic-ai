-- AlterEnum
ALTER TYPE "AccountMethod" ADD VALUE 'EMAIL';

-- CreateTable
CREATE TABLE "users_devices" (
    "model_name" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "device_name" TEXT NOT NULL,
    "device_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_devices_device_token_key" ON "users_devices"("device_token");

-- AddForeignKey
ALTER TABLE "users_devices" ADD CONSTRAINT "users_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
