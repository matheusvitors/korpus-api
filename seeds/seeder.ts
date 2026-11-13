import { DATABASE_URL } from '@/infra/config/environment';
import 'dotenv/config';
import mysql from 'mysql2/promise';

const seeder = async () => {
	try {
		const connection = await mysql.createConnection({
			uri: DATABASE_URL!
		})
		const { USER_ID, USER_NOME, USER_USERNAME, USER_PASSWORD, USER_EMAIL } = process.env;
		const sql = 'INSERT INTO `usuarios` (`id`, `nome`, `username`, `password`, `email`) VALUES (?, ?, ?, ?, ?);'
		const values: mysql.ExecuteValues = [USER_ID!, USER_NOME!, USER_USERNAME!, USER_PASSWORD!, USER_EMAIL!];

		const [result, fields] = await connection.execute(sql, values);

		console.log(result);
		console.log(fields);
		return;

	} catch (error) {
		throw error;
	}

}

seeder();
