CREATE TABLE `usuarios` (
	`id` varchar(255) PRIMARY KEY,
	`nome` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `id_unique` UNIQUE INDEX(`id`),
	CONSTRAINT `username_unique` UNIQUE INDEX(`username`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
