ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','manager','employee','moderator') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `permissions` text;--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;