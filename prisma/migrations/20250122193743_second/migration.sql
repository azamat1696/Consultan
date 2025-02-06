/*
  Warnings:

  - You are about to drop the column `danışman onaylama süreç bilgisi` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `danışman onaylama süreç bilgisi`,
    ADD COLUMN `check_up_status` VARCHAR(191) NULL;
