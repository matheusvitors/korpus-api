import Jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { JwtError } from "@/application/errors";
import { JWT_EXPIRE, SECRET } from "@/infra/config/environment";

interface JwtEncodeParams {
	payload: any;
	expiration?: string;
	secret?: string;
}

export const jwt = {
	encode: ({ payload, expiration, secret }: JwtEncodeParams): string => {
		if (SECRET) {
			try {
				return Jwt.sign(
					{ payload },
					secret || SECRET,
					{expiresIn: (expiration || JWT_EXPIRE) as ms.StringValue}
				);
			} catch (error: any) {
				throw new JwtError(error.message);
			}
		} else {
			throw new JwtError('A secret must be specified.');
		}
	},

	verify: (jwt: string, secret?: string): JwtPayload => {
		try {
			if (SECRET) {
				const data = Jwt.verify(jwt, secret || SECRET);
				if(typeof data === 'string') {
					return JSON.parse(data);
				}
				return data;
			} else {
				throw new JwtError('A secret must be specified.');
			}
		} catch (error) {
			throw error;
		}

	}
}


