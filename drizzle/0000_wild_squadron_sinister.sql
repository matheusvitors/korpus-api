CREATE TABLE `usuarios` (
	`id` varchar(255) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_id_unique` UNIQUE(`id`),
	CONSTRAINT `usuarios_username_unique` UNIQUE(`username`),
	CONSTRAINT `usuarios_email_unique` UNIQUE(`email`)
);
