import { eq } from "drizzle-orm";
import { Repository } from "@/application/interfaces";
import { Usuario } from "@/core/models";
import { database } from "@/infra/database/database";
import { usuariosTable } from "@/infra/database/schema";
import { toUsuario } from "@/utils/transforms";
import { UsuarioDTO } from "@/application/dto";

export const usuarioRepository: Repository<Usuario, UsuarioDTO> = {
	list: async (): Promise<Usuario[]> => {
		throw new Error("Function not implemented.");

	},

	get: async (id: string): Promise<Usuario | null> => {
		try {

			const [data] = await database.select().from(usuariosTable).where(eq(usuariosTable.id, id));

			if(!data) {
				return null;
			}

			return toUsuario(data);

		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	find: async (field: keyof UsuarioDTO, value: any): Promise<Usuario | null> => {
		try {
			const [data] = await database.select().from(usuariosTable).where(eq(usuariosTable[field], value));

			if (!data) {
				return null;
			}

			return toUsuario(data);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	create: async (input: Usuario): Promise<void> => {
		try {
			await database.insert(usuariosTable).values({
				id: input.id,
				nome: input.nome,
				username: input.username,
				password: input.password,
				email: input.email
			});

		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	edit: function (data: Usuario): Promise<void | null> {
		throw new Error("Function not implemented.");
	},

	remove: function (id: string): Promise<void> {
		throw new Error("Function not implemented.");
	}
}
