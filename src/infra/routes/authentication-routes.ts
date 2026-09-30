import { Request, Response, Router } from "express";
import { route } from "@/infra/adapters/route";
import { authenticationController } from "@/application/controllers";
import { usuarioRepository } from "@/infra/database/repositories";

const router = Router();

router.post('/login', async (request: Request, response: Response) => {
	const responseData = await authenticationController({
		repository: usuarioRepository,
		username: request.body.username,
		password: request.body.password,
	});
	return route({ response, responseData });

})

export { router as AuthenticationRoutes };
