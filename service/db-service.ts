import Database from "../database/postgres/config.js";

class DBService {
	static instance: DBService;

	async updateBuildStatus(buildId: number, status: string) {
		await Database.getInstance().none('UPDATE build SET status = $(status) WHERE id = $(build_id)', {
			build_id: buildId,
			status
		});
	}

	static getInstance() {
		if (!DBService.instance) {
			DBService.instance = new DBService();
		}
		return DBService.instance;
	}
}

export default DBService;