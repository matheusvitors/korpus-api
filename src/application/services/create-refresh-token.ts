import { Usuario } from "@/core/models";
import { jwt } from "@/infra/adapters/jwt";
import { REFRESH_SECRET, REFRESH_TOKEN_EXPIRE } from "@/infra/config/environment";

export const createRefreshToken = (usuario: Usuario) => {
	try {
		return jwt.encode({payload: {auth: true, id: usuario.id}, secret: REFRESH_SECRET, expiration: REFRESH_TOKEN_EXPIRE});
	} catch (error) {
		throw error;
	}

}
