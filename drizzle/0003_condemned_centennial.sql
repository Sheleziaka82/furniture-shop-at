ALTER TABLE `orders` ADD `stripePaymentIntentId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `stripeCheckoutSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);