import supertest from "supertest";
import Jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { vi, afterEach, beforeEach, expect, describe, it } from "vitest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { REFRESH_SECRET } from "@/infra/config/environment";
import { user } from "../../artifacts";

vi.mock("@/infra/adapters/jwt", () => ({
	jwt: {
		encode: vi.fn(),
		verify: vi.fn(),
	}
}));

describe('Refresh token - e2e Test', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});


	it('should refresh the token using a valid refreshToken', async () => {
		const refreshToken = Jwt.sign(
			{ id: user.id },
			REFRESH_SECRET || 'refreshsecret',
			{ expiresIn: '7d' }
		);

		vi.mocked(jwt.verify).mockImplementation(() => (Jwt.verify(refreshToken, REFRESH_SECRET!) as JwtPayload));


		const response = await supertest(app)
			.post('/auth/refresh')
			.send({ refreshToken });

			console.log(response.body);


		expect(response.status).toEqual(200);
		expect(response.body).toHaveProperty('token');
		expect(response.body).toHaveProperty('refreshToken');
	});

	it('should deny refresh if refreshToken is expired', async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new TokenExpiredError('jwt expired', new Date());
		});

		const response = await supertest(app)
			.post('/auth/refresh')
			.send({ refreshToken: 'expired-token' });

		expect(response.status).toEqual(401);
	});

	it('should deny refresh if refreshToken is invalid', async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new JsonWebTokenError('Invalid token');
		});

		const response = await supertest(app)
			.post('/auth/refresh')
			.send({ refreshToken: 'invalid-token' });

		expect(response.status).toEqual(401);
	});

	it('should deny refresh if refreshToken is not provided', async () => {
		const response = await supertest(app)
			.post('/auth/refresh')
			.send({});

		expect(response.status).toEqual(401);
	});

});
