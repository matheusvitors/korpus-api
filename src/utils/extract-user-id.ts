import { jwt } from "@/infra/adapters/jwt";
import { Request } from 'express';

export const extractUserId = (request: Request): string => {
// export const extractUserId = (token: string | undefined): string => {
	const token = request.headers['authorization']?.split(' ')[1]
	if(token) {
		return jwt.verify(token).payload.id;
	} else {
		throw new Error("Token inválido!");
	}
}
