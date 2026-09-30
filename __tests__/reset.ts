import { database } from "@/infra/database/database";
import * as schema from '../src/infra/database/schema'
import { reset } from "drizzle-seed";

export const clearDatabase = async () => {
	await reset(database, schema);
	console.log('banco limpo');
}


async function main() {
	await clearDatabase();
}

main();
