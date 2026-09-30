import cors from "cors";
import { json, urlencoded } from "express";
import { authorization } from "@/infra/middlewares/authorization";
import { requestLogger } from "@/infra/middlewares/requests-logger";
import { security } from "@/infra/middlewares/security";

export const middlewares = [
	json(),
	urlencoded({extended: false}),
	cors(),
	requestLogger,
	security,
	authorization,
]
