CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text,
	`amount` integer,
	`type` text,
	`category` text,
	`description` text
);
