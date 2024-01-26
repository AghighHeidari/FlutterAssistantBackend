import Database from "../database/postgres/config.js";
import {errors} from "../consts/errors.js";

export class AuthController {
	static instance: AuthController;

	async login(username: string, password: string) {
		const user = await Database.getInstance().oneOrNone(`SELECT *
                                                             FROM customer
                                                             WHERE username = $(username)`, {
			username,
			password
		});
		if (!user) {
			return {success: false, error: errors.USER_NOT_FOUND};
		}
		if (user && user.password !== password) {
			return {success: false, error: errors.INCORRECT_PASSWORD};
		}
		return {success: true, data: {customer: user}};
	}

	async register(username: string, password: string) {
		const user = await Database.getInstance().oneOrNone(`SELECT *
                                                             FROM customer
                                                             WHERE username = $(username);`, {
			username,
			password
		});
		if (user) {
			return {success: false, error: errors.USERNAME_ALREADY_EXISTS};
		}
		const newUser = await Database.getInstance().one(`INSERT INTO customer(username, password)
                                                          VALUES ($(username), $(password))
                                                          RETURNING *`, {username, password});
		return {success: true, data: {customer: newUser}};
	}

	static getInstance() {
		if (!AuthController.instance) {
			AuthController.instance = new AuthController();
		}
		return AuthController.instance;
	}

	constructor() {
	}

}

export default AuthController;