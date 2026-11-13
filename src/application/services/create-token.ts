import { Usuario } from "@/core/models";
import { jwt } from "@/infra/adapters/jwt";

export const createToken = (usuario: Usuario): string => {
	try {
		return jwt.encode({payload: {auth: true, id: usuario.id}});
	} catch (error) {
		throw error;
	}
}
