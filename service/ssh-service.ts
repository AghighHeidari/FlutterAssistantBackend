import {Config, NodeSSH, SSHExecCommandResponse} from 'node-ssh';
import _ from "lodash";
import DBService from "./db-service.js";
import axios from "axios";
import BlueBird from "bluebird";

class SSHService {
	static instance: SSHService;
	ssh: NodeSSH;
	private readonly config = {
		host: process.env.SSH_HOST || '156.236.31.192',
		port: process.env.SSH_PORT ? _.toNumber(process.env.SSH_PORT) : 2112,
		username: process.env.SSH_USER || 'root',
		privateKey: `-----BEGIN OPENSSH PRIVATE KEY-----
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
1got99UGhIr7WCV64UcDMr6h4=
-----END OPENSSH PRIVATE KEY-----`,
		passphrase: process.env.SSH_PRIVATE_KEY_PASSPHRASE || '',
	}

	private constructor() {
		this.ssh = new NodeSSH();
	}

	async connect() {
		if (this.ssh.isConnected()) {
			return;
		}
		const promise = new BlueBird(async (resolve, reject) => {
			if (!this.ssh.isConnected()) {
				try {
					await this.ssh.connect(this.config);
					resolve(true);
				} catch (e) {
					resolve(false);
				}
			} else {
				resolve(true);
			}
		});
		const promises = [];
		promises.push(promise, promise, promise, promise, promise);
		await BlueBird.mapSeries(promises, async (promise) => {
			await promise;
		});
		if (this.ssh.isConnected()) {
			console.log(`SSH connected to ${this.config.host}:${this.config.port} as ${this.config.username}`);
		} else {
			throw Error('SSH Connection Failed');
		}
	}

	async exec(command: string, params: []): Promise<SSHExecCommandResponse | null> {
		await this.connect();
		let res: SSHExecCommandResponse | null = null;
		const promise = new BlueBird(async (resolve, reject) => {
			if (!res) {
				try {
					console.log(`⏳ Running command [${command}] ...`);
					res = await this.ssh.execCommand(command);
					console.log(`✅ Command [${command}] ran successfully!`);
					resolve(res);
				} catch (e) {
					resolve(null)
				}
			} else {
				resolve(res);
			}
		})
		const promises = [];
		promises.push(promise, promise, promise, promise, promise);
		await BlueBird.mapSeries(promises, async promise => {
			await promise;
		});
		return res;
	}

	async projectsExists(project: string) {
		let res = await this.exec('ls', []);
		if (!res) {
			return false;
		}
		if (res.code !== 0) return false;
		return res.stdout.split('\n').includes(project);
	}

	async createProject(buildId: number, project: string) {
		try {
			await DBService.getInstance().updateBuildStatus(buildId, 'creating_flutter_project');
			// if (!await this.projectsExists(project)) {
			const res = await this.exec(`flutter create ${project};`, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
			// }
			// return true;
		} catch (e) {
			return false;
		}
	}

	async updateCode(buildId: number, code: string, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'updating_code');
		try {
			const res = await this.exec(`cat << 'EOF' > ~/${project}/lib/main.dart
${code}
EOF`, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
		} catch (e) {
			return false;
		}
	}

	async analyzeProject(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'analyzing_project');
		try {
			const res = await this.exec(`cd ~/${project}; flutter analyze;`, []);
			if (!res) {
				return false;
			}
			if (res.code === 0) return true;
			return !res.stdout.includes('error •');
		} catch (e) {
			return false;
		}
	}

	async buildProject(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'building_project');
		try {
			const res = await this.exec(`cd ~/${project}; flutter build web --release;`, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
		} catch (e) {
			return false;
		}
	}

	async moveProjectBuild(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'moving_project');
		try {
			const res = await this.exec(`cp -r ~/${project}/build/web/ /var/www/aghighheidari/${project}`, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
		} catch (e) {
			return false;
		}
	}

	async createNginxConfig(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'creating_nginx_config');
		try {
			const script = `
		cd /etc/nginx/sites-available;
		touch ${project}.aghighheidari.ir.conf;
		ln /etc/nginx/sites-available/${project}.aghighheidari.ir.conf /etc/nginx/sites-enabled/${project}.aghighheidari.ir.conf;
		cat << 'EOF' > ${project}.aghighheidari.ir.conf
server {
    server_name ${project}.aghighheidari.ir;

    root /var/www/aghighheidari/${project};

    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
		systemctl restart nginx;`;
			const res = await this.exec(script, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
		} catch (e) {
			return false;
		}
	}

	async handleDNSRecord(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'adding_dns_record');
		let data = JSON.stringify({
			content: process.env.SSH_HOST || '156.236.31.192',
			name: `${project}.aghighheidari.ir`,
			proxied: false,
			type: "A",
			comment: "",
			ttl: 1
		});

		let config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID || '0b97b95bf75b05ca391e0b290275ad43'}/dns_records`,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.CLOUDFLARE_TOKEN || ''}`
			},
			data: data
		};

		try {
			await axios.request(config);
			return true;
		} catch (e: any) {
			try {
				return e?.response?.data?.errors[0]?.code === 81057;
			} catch (e) {
				return false;
			}
		}
	}

	async handleSSLCertificate(buildId: number, project: string) {
		await DBService.getInstance().updateBuildStatus(buildId, 'handling_ssl_certificate');
		try {
			const script = `certbot run -n --nginx --agree-tos -d ${project}.aghighheidari.ir  -m  heidariaghigh@gmail.com  --redirect`;
			const res = await this.exec(script, []);
			if (!res) {
				return false;
			}
			return res.code === 0;
		} catch (e) {
			return false;
		}
	}

	async publishCode(buildId: number, code: string, project: string = 'first_app') {
		if (!await this.createProject(buildId, project)) return false;
		if (!await this.updateCode(buildId, code, project)) return false;
		if (!await this.analyzeProject(buildId, project)) return false;
		if (!await this.buildProject(buildId, project)) return false;
		if (!await this.moveProjectBuild(buildId, project)) return false;
		if (!await this.createNginxConfig(buildId, project)) return false;
		if (!await this.handleDNSRecord(buildId, project)) return false;
		if (!await this.handleSSLCertificate(buildId, project)) return false;
		return `https://${project}.aghighheidari.ir`;
	}

	static getInstance() {
		if (!SSHService.instance) {
			SSHService.instance = new SSHService();
		}
		return SSHService.instance;
	}
}

export default SSHService;