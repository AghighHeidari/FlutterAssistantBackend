import {handleResponse} from "../utils/response-handler.js";
import {errors} from "../consts/errors.js";
import SSHService from "../service/ssh-service.js";
import OpenaiService from "../service/openai-service.js";
import Database from "../database/postgres/config.js";
import DBService from "../service/db-service.js";
import {promptify} from "../utils/utilities.js";
import BlueBird from "bluebird";

class OpenaiController {
	static instance: OpenaiController;

	async create(user_id: number, requirements: any) {
		const user: {
			id: number;
			username: string;
			password: string;
			row_creation_time: Date;
		} | null = await Database.getInstance().oneOrNone(`SELECT *
                                                           FROM customer
                                                           WHERE id = $(user_id)`, {user_id});
		if (!user) {
			return {success: false, error: errors.USER_NOT_FOUND};
		}
		const build = await Database.getInstance().one(`INSERT INTO build (customer_id, requirements)
                                                        VALUES ($(user_id), $(requirements)::jsonb)
                                                        RETURNING *`, {
			user_id,
			requirements: JSON.stringify(requirements)
		});
		await DBService.getInstance().updateBuildStatus(build.id, 'started');
		this.startProcess(build.id, user, requirements);
		return {success: true, data: {build}};
	}

	async checkBuild(buildId: number) {
		const build = await Database.getInstance().oneOrNone('SELECT * FROM build WHERE id = $(build_id)', {
			build_id: buildId
		});
		if (!build) {
			return {success: false, error: errors.BUILD_NOT_FOUND};
		}
		return {success: true, data: {build}};
	}

	async startProcess(buildId: number, user: {
		id: number;
		username: string;
		password: string;
		row_creation_time: Date;
	}, requirements: any) {
		let threadId: string | null = null;
		let url: string | boolean = false
		await DBService.getInstance().updateBuildStatus(buildId, 'creating_thread');

		let threadPromises = [];
		const threadPromise = new BlueBird(async (resolve, reject) => {
			if (threadId) {
				resolve(threadId);
				return;
			}
			try {
				threadId = await OpenaiService.getInstance().createThread(OpenaiService.assistantId);
				if (threadId) {
					await Database.getInstance().none(`UPDATE build
                                                       SET thread_id = $(thread_id)
                                                       WHERE id = $(build_id)`, {thread_id: threadId, build_id: buildId});
					resolve(threadId);
				}
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
		threadPromises.push(threadPromise, threadPromise, threadPromise, threadPromise, threadPromise);
		await BlueBird.mapSeries(threadPromises, async (promise) => {
			await promise;
		});
		if (!threadId) {
			console.error('Creating thread failed!');
			await DBService.getInstance().updateBuildStatus(buildId, 'error');
			return;
		}

		await DBService.getInstance().updateBuildStatus(buildId, 'generating_code');
		let promptPromises = [];
		const promptPromise = new BlueBird(async (resolve, reject) => {
			if (url) {
				resolve(url);
				return;
			}
			try {
				const response = await OpenaiService.getInstance().sendPromptToAssistant(OpenaiService.assistantId, threadId!, promptify(requirements));
				if (response) {
					const code = response.replace('```dart', '').replace('```', '');
					try {
						url = await SSHService.getInstance().publishCode(buildId, code, user.username);
						if (url) {
							await DBService.getInstance().updateBuildStatus(buildId, 'finished');
							resolve(url)
						} else {
							console.error('Publishing code failed!');
							reject('Publishing code failed!');
						}
					} catch (e: any) {
						console.log(e);
						reject(e);
					}
				}
			} catch (e) {
				console.log(e);
				reject(e)
			}
		});
		promptPromises.push(promptPromise, promptPromise, promptPromise, promptPromise, promptPromise);
		await BlueBird.mapSeries(promptPromises, async (promise) => {
			await promise;
		});

		if (url) {
			await Database.getInstance().none(`UPDATE build
                                               SET url = $(url)
                                               WHERE id = $(build_id)`, {url, build_id: buildId});
		}
		else {
			await DBService.getInstance().updateBuildStatus(buildId, 'error');
		}
	}

	static getInstance() {
		if (!OpenaiController.instance) {
			OpenaiController.instance = new OpenaiController();
		}
		return OpenaiController.instance;
	}
}

export default OpenaiController;