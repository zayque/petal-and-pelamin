-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `passwordHash` VARCHAR(100) NOT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(160) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `category` ENUM('HALL', 'PACKAGE', 'DAIS', 'DRESS', 'PHOTOBOOTH') NOT NULL,
    `tagline` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `features` JSON NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `priceUnit` VARCHAR(40) NOT NULL DEFAULT 'per event',
    `capacity` INTEGER NULL,
    `location` VARCHAR(160) NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `gallery` JSON NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    INDEX `Service_category_isActive_idx`(`category`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `eventDate` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CartItem_userId_serviceId_eventDate_key`(`userId`, `serviceId`, `eventDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` ENUM('PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    `contactName` VARCHAR(120) NOT NULL,
    `contactEmail` VARCHAR(190) NOT NULL,
    `contactPhone` VARCHAR(30) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `state` VARCHAR(80) NOT NULL,
    `notes` TEXT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `deposit` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `paymentMethod` VARCHAR(40) NULL,
    `paymentRef` VARCHAR(60) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booking_code_key`(`code`),
    INDEX `Booking_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `category` ENUM('HALL', 'PACKAGE', 'DAIS', 'DRESS', 'PHOTOBOOTH') NOT NULL,
    `eventDate` DATE NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    INDEX `BookingItem_serviceId_eventDate_idx`(`serviceId`, `eventDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedDate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NULL,
    `date` DATE NOT NULL,
    `reason` VARCHAR(160) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BlockedDate_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `eventDate` DATE NULL,
    `body` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingItem` ADD CONSTRAINT `BookingItem_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingItem` ADD CONSTRAINT `BookingItem_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlockedDate` ADD CONSTRAINT `BlockedDate_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
