ALTER TABLE `comments` DROP FOREIGN KEY `comments_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `ratings` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `user_id`;