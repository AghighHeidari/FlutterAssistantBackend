import express from 'express';
import {errors} from "../consts/errors.js";
import AuthController from "../controller/auth-controller.js";
import {handleResponse} from "../utils/response-handler.js";

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
	const {username, password} = req.body;
	if (!username) {
		return handleResponse(req, res, {success: false, error: errors.USERNAME_IS_REQUIRED})
	}
	if (!password) {
		return handleResponse(req, res, {success: false, error: errors.PASSWORD_IS_REQUIRED})
	}
	const response = await AuthController.getInstance().login(username, password);
	return handleResponse(req, res, response);
});

authRouter.post('/register', async (req, res) => {
	const {username, password} = req.body;
	if (!username) {
		return handleResponse(req, res, {success: false, error: errors.USERNAME_IS_REQUIRED})
	}
	if (!password) {
		return handleResponse(req, res, {success: false, error: errors.PASSWORD_IS_REQUIRED})
	}
	const response = await AuthController.getInstance().register(username, password);
	return handleResponse(req, res, response);
});

export default authRouter;