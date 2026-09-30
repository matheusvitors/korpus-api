declare global {
	namespace NodeJs {
		export interface ProcessEnv{
			[key: string]: string;
			PORT: string;
			DATABASE_URL: string;
		}
	}
}

export {}
