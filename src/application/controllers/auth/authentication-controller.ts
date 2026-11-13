import { UsuarioDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { createRefreshToken, createToken } from "@/application/services";
import { Usuario } from "@/core/models";
import { verifyHash } from "@/infra/adapters/encryption";
import { unauthorized, success, serverError } from "@/infra/adapters/response-wrapper";

interface AuthenticationControllerParams {
	repository: Repository<Usuario, UsuarioDTO>;
	username: string;
	password: string;
}

export const authenticationController = async (params: AuthenticationControllerParams): Promise<ResponseData> => {
	try {
		const { repository, username, password } = params;

		const usuario = await repository.find!('username', username);

		if(!usuario || !password) {
			return unauthorized('Usuário ou senha incorreta.');
		}

		const isCorrectPassword = await verifyHash(password, usuario.password);

		if(!isCorrectPassword) {
			return unauthorized('Usuário ou senha incorreta.');
		}

		return success({token: createToken(usuario), refreshToken: createRefreshToken(usuario)})
	} catch (error) {
		console.error(error);
		return serverError(error)
	}
}
