CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`hashed_password` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `users_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `transactions` ADD `updated_at` text;