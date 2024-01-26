import express from 'express';
import OpenaiController from "../controller/openai-controller.js";
import {handleResponse} from "../utils/response-handler.js";
import {errors} from "../consts/errors.js";
import _ from "lodash";

const openaiRouter = express.Router();

openaiRouter.post('/create', async (req, res) => {
	let {user_id, requirements} = req.body;
	if (typeof requirements === 'string') {
		requirements = JSON.parse(requirements)
	}
	const response = await OpenaiController.getInstance().create(user_id, requirements);
	return handleResponse(req, res, response);
});

openaiRouter.get('/check-build/:id', async (req, res) => {
	const {id} = req.params;
	if (!id) {
		return handleResponse(req, res, {success: false, error: errors.BUILD_ID_REQUIRED})
	}
	let buildId: number;
	try {
		buildId = _.toNumber(id);
	} catch (e) {
		return handleResponse(req, res, {success: false, error: errors.BUILD_ID_REQUIRED})
	}
	const response = await OpenaiController.getInstance().checkBuild(buildId);
	return handleResponse(req, res, response);
});

export default openaiRouter;