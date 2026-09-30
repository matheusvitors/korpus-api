import { TEST_TYPE } from "@/infra/config/environment.js";
import { usuarioRepository } from "@/infra/database/repositories/usuario-repository.js";
import { beforeAll } from "vitest";
import { user } from "./artifacts";

beforeAll(async () => {
	if (TEST_TYPE === "e2e") {
		const result = await usuarioRepository.get(user.id);
		if (!result) {
			await usuarioRepository.create(user);
		}
	}
});
