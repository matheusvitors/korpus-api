import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { DATABASE_URL } from '@/infra/config/environment';

const database = drizzle(DATABASE_URL!);

export { database }
