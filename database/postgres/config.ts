import Promise from 'bluebird';
import pg_promise from 'pg-promise';
import _ from "lodash";
class Database {
	private db;
	private static instance: Database;
	constructor() {
		const config = {
			host: process.env.PGDB_HOST || 'localhost',
			port: process.env.PGDB_PORT ? _.toNumber(process.env.PGDB_PORT) : 5432,
			database: process.env.PGDB_DATABASE_NAME || 'flutter_assistant_db',
			user: process.env.PGDB_USERNAME || 'aghigh',
			password: process.env.PGDB_PASSWORD || '123456',
			ssl: false,
		};
		this.db = pg_promise({promiseLib: Promise})(config);
		this.db.one('SELECT NOW(), current_database();').then((data: { now: any; current_database: any; }) => {
			console.log('Database connected at', data.now, 'to', data.current_database);
		});
	}
	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance.db;
	}
}

export default Database;


