ALTER TABLE `categories` ADD `parentId` int;--> statement-breakpoint
ALTER TABLE `categories` ADD `displayOrder` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `categories` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;