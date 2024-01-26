import BlueBird from "bluebird";
import SSHService from "../service/ssh-service.js";

new BlueBird(async (resolve, reject) => {
	const sshServiceInstance = SSHService.getInstance();
	await new Promise(resolve => setTimeout(resolve, 5000));
	const res = await sshServiceInstance.ssh.exec('cd ~/first_app; ls;', [],);
	console.log(res);
}).then((result) => {
	if (result) {
		console.log(result);
	}
	process.exit(0);
});