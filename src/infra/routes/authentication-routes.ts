import { Request, Response, Router } from "express";
import { route } from "@/infra/adapters/route";
import { authenticationController, refreshTokenController } from "@/application/controllers/auth";
import { usuarioRepository } from "@/infra/database/repositories";

const router = Router();

router.post('/auth/login', async (request: Request, response: Response) => {
	const responseData = await authenticationController({
		repository: usuarioRepository,
		username: request.body.username,
		password: request.body.password,
	});
	return route({ response, responseData });

})

router.post('/auth/refresh', async (request: Request, response: Response) => {
	const responseData = await refreshTokenController({
		repository: usuarioRepository,
		refreshToken: request.body.refreshToken
	});
	return route({ response, responseData });
})

router.post('/auth/logout', async (request: Request, response: Response) => {
	const responseData = await refreshTokenController({
		repository: usuarioRepository,
		refreshToken: request.body.refreshToken
	});
	console.log({responseData});

	return route({ response, responseData });
})

export { router as AuthenticationRoutes };
