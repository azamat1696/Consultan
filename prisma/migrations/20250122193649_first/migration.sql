-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female', 'other') NULL,
    `title` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `profile_image` LONGBLOB NULL,
    `latest_time_for_appointment` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `danışman onaylama süreç bilgisi` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `education_id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_name` VARCHAR(191) NULL,
    `educational_degree` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`education_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `certificate_id` INTEGER NOT NULL AUTO_INCREMENT,
    `certificate_name` VARCHAR(191) NULL,
    `issuing_organization` VARCHAR(191) NULL,
    `given_date` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`certificate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpertKnowledge` (
    `expert_knowledge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `consultant_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`expert_knowledge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsultantExpertiseLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consultant_id` INTEGER NOT NULL,
    `expertise_id` INTEGER NOT NULL,
    `workspaces` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expertise` (
    `expertise_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`expertise_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workspace` (
    `workspace_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`workspace_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyCalendar` (
    `weekly_calendar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `day_and_hours` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`weekly_calendar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Packet` (
    `packet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `packet_type` VARCHAR(191) NULL,
    `packet_title` VARCHAR(191) NULL,
    `packet_minutes` INTEGER NULL,
    `meeting_times` INTEGER NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discounted_price` DECIMAL(10, 2) NOT NULL,
    `meeting_description` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`packet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillingInfo` (
    `bill_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `iban` VARCHAR(191) NULL,
    `tckn` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_time` DATETIME(3) NOT NULL,
    `packet_id` INTEGER NOT NULL,
    `consultant_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialMedia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `linkedin` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpertKnowledge` ADD CONSTRAINT `ExpertKnowledge_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultantExpertiseLink` ADD CONSTRAINT `ConsultantExpertiseLink_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsultantExpertiseLink` ADD CONSTRAINT `ConsultantExpertiseLink_expertise_id_fkey` FOREIGN KEY (`expertise_id`) REFERENCES `Expertise`(`expertise_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyCalendar` ADD CONSTRAINT `WeeklyCalendar_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Packet` ADD CONSTRAINT `Packet_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillingInfo` ADD CONSTRAINT `BillingInfo_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_packet_id_fkey` FOREIGN KEY (`packet_id`) REFERENCES `Packet`(`packet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_consultant_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocialMedia` ADD CONSTRAINT `SocialMedia_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
