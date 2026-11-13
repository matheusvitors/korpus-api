import supertest from "supertest";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { vi, afterEach, beforeEach, expect, describe, it } from "vitest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { SECRET, REFRESH_SECRET } from "@/infra/config/environment";
import { user } from "../../artifacts";

vi.mock("@/infra/adapters/jwt", () => ({
	jwt: {
		encode: vi.fn(),
		verify: vi.fn(),
	}
}));

describe('Authentication - e2e Test', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should authenticate a user and return token and refreshToken', async () => {
		const credentials = {
			username: user.username,
			password: user.password,
		};

		const token = sign({ id: user.id }, SECRET || 'thisisascret', { expiresIn: '15m' });
		vi.mocked(jwt.encode).mockImplementation(() => (token));

		// const refreshToken = sign({ id: 'user-id-123' }, REFRESH_SECRET || 'refreshsecret', { expiresIn: '7d' });

		const response = await supertest(app)
			.post('/auth/login')
			.send(credentials);

		expect(response.status).toEqual(200);
		expect(response.body.response.content).toHaveProperty('token');
		expect(response.body.response.content).toHaveProperty('refreshToken');
		expect(typeof response.body.response.content.token).toEqual('string');
		expect(typeof response.body.response.content.refreshToken).toEqual('string');

		// Valida que o token é um JWT válido
		const decoded = verify(response.body.response.content.token, SECRET || 'thisisascret');
		expect(decoded).toHaveProperty('id');
	});

	it('should deny authentication if username is missing', async () => {
		const response = await supertest(app)
			.post('/auth/login')
			.send({ password: user.password });

		expect(response.status).toEqual(401);
		expect(response.body.response.message).toEqual('Usuário ou senha incorreta.');
	});

	it('should deny authentication if password is missing', async () => {
		const response = await supertest(app)
			.post('/auth/login')
			.send({ username: user.username });

		expect(response.status).toEqual(401);
		expect(response.body.response.message).toEqual('Usuário ou senha incorreta.');
	});

	it('should deny authentication if credentials are invalid', async () => {
		const response = await supertest(app)
			.post('/auth/login')
			.send({
				username: user.username,
				password: 'wrong-password',
			});

		expect(response.status).toEqual(401);
		expect(response.body.response.message).toEqual('Usuário ou senha incorreta.');
	});

	it('should deny authentication if user does not exist', async () => {
		const response = await supertest(app)
			.post('/auth/login')
			.send({
				username: 'nonexistent.user',
				password: 'AnyPass@123',
			});

		expect(response.status).toEqual(401);
		expect(response.body.response.message).toEqual('Usuário ou senha incorreta.');
	});

	it('should deny authentication if token generation fails', async () => {
		vi.mocked(jwt.encode).mockImplementation(() => {
			throw new JsonWebTokenError('Failed to sign token');
		});

		const response = await supertest(app)
			.post('/auth/login')
			.send({
				username: user.username,
				password: user.password,
			});

		expect(response.status).toEqual(500);
	});

	it('should logout and invalidate the refreshToken', async () => {
		const refreshToken = sign(
			{ id: user.id },
			REFRESH_SECRET || 'refreshsecret',
			{ expiresIn: '7d' }
		);

		const response = await supertest(app)
			.post('/auth/login')
			.send({ refreshToken });

		expect(response.status).toEqual(204);
	});
});
