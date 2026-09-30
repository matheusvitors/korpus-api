import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { int, varchar } from "drizzle-orm/mysql-core/columns";

export const usuariosTable = mysqlTable('usuarios', {
	id: varchar({ length: 255 }).primaryKey().unique().notNull(),
	nome: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).unique().notNull(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).unique().notNull()
})

