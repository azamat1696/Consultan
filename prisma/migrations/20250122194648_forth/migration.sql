/*
  Warnings:

  - You are about to alter the column `profile_image` on the `User` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `profile_image` VARCHAR(191) NULL;
