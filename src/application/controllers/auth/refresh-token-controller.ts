import { UsuarioDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { createRefreshToken, createToken } from "@/application/services";
import { Usuario } from "@/core/models";
import { jwt } from "@/infra/adapters/jwt";
import { serverError, success, unauthorized } from "@/infra/adapters/response-wrapper";
import { REFRESH_SECRET } from "@/infra/config/environment";

interface refreshTokenControllerParams {
	repository: Repository<Usuario, UsuarioDTO>;
	refreshToken: string;
}

export const refreshTokenController = async (params: refreshTokenControllerParams): Promise<ResponseData> => {
	try {
		const { repository, refreshToken } = params;

		const tokenData = jwt.verify(refreshToken, REFRESH_SECRET);

		const usuario = await repository.get(tokenData.id);

		if(!usuario) {
			return unauthorized('sem usuario');
		}
		console.log({token: createToken(usuario), refreshToken: createRefreshToken(usuario)});

		return success({token: createToken(usuario), refreshToken: createRefreshToken(usuario)})
	} catch (error: any) {
		let status = 500;

		if(error.name === 'TokenExpiredError' ||
			error.name === 'JsonWebTokenError' ||
			error.name === 'NotBeforeError') {
			status = 401;
		}

		return status === 401 ? unauthorized() : serverError(error);
	}
}
