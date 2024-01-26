import OpenAI from "openai";
import {Beta, Chat} from "openai/resources/index";
import fs from "fs";
import _ from "lodash";
import {ChatCompletionStream} from "openai/lib/ChatCompletionStream";
import AssistantCreateParams = Beta.AssistantCreateParams;
import ChatCompletionMessage = Chat.ChatCompletionMessage;

export class OpenaiService {
	private openai: OpenAI;
	static instance: OpenaiService;
	static assistantId = 'asst_wW2gLwn2JL6Vk9Egtoqj1TFA';
	static apiKey = process.env.OPENAI_API_KEY || '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';

	constructor() {
		this.openai = new OpenAI({
			apiKey: OpenaiService.apiKey,
		});
	}

	async sendPrompt(prompt: string, messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [], model = 'gpt-3.5-turbo'): Promise<{
		response: ChatCompletionMessage;
		message: { role: string; content: string }
	}> {
		const chatCompletion = await this.openai.chat.completions.create({
			messages: [...messages, {role: 'user', content: prompt}],
			model: model,
		});
		return {
			message: {role: 'user', content: prompt},
			response: chatCompletion.choices[0].message,
		};
	}

	async createAssistant(assistantName: string) {
		try {
			const assistants = await this.openai.beta.assistants.list();
			let assistant = assistants.data.find((assistant) => assistant.name === assistantName);
			if (!assistant) {
				const assistantConfig: AssistantCreateParams = {
					name: assistantName,
					instructions: "You are a product purchase assistant." +
						"\nI would ask you some questions about product and you should answer them to help me." +
						"\nAll needed information about product is in uploaded file. You have access to a json file containing required data." +
						"You should inspect the uploaded file thoroughly." +
						"\nYou can use it to answer questions." +
						"\nOnly answer in Farsi." +
						"\nWhen I mention product, i mean the product data in files.",
					tools: [
						{type: 'retrieval'},
						{type: 'code_interpreter'},
					],
					model: 'gpt-4-1106-preview'
				};
				assistant = await this.openai.beta.assistants.create(assistantConfig);
			}
			return assistant;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async addFileToAssistant(assistant: OpenAI.Beta.Assistants.Assistant | null, filePath: string) {
		try {
			let existingFileIds = assistant!.file_ids || [];
			if (existingFileIds.length > 0) {
				return assistant!.file_ids![0];
			}
			const fileId = await this.uploadFile(filePath);
			if (!fileId) {
				return null;
			}
			await this.openai.beta.assistants.update(assistant!.id, {file_ids: [...existingFileIds, fileId]});
			assistant = await this.getAssistant(assistant!.id);
			if (!_.includes(assistant?.file_ids || [], fileId)) {
				return null;
			}
			return fileId;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async getAssistant(assistantId: string) {
		try {
			return await this.openai.beta.assistants.retrieve(assistantId);
		} catch (e) {
			console.log(e);
			return null;
		}

	}

	async createThread(assistantId: string) {
		try {
			const thread = await this.openai.beta.threads.create();
			// const runId = await this.createRun(assistantId, thread.id);
			// return {
			// 	threadId: thread.id,
			// runId: runId,
			// };
			return thread.id;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async createRun(assistantId: string, threadId: string) {
		const run = await this.openai.beta.threads.runs.create(threadId, {
			assistant_id: assistantId,
		});

		let runStatus = await this.openai.beta.threads.runs.retrieve(
			threadId,
			run.id
		);

		while (runStatus.status !== "completed") {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			runStatus = await this.openai.beta.threads.runs.retrieve(
				threadId,
				run.id
			);

			if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
				console.log(
					`Run status is '${runStatus.status}'. Unable to complete the request.`
				);
				break;
			}
		}
		return runStatus;
	}

	async sendPromptToAssistant(assistantId: string, threadId: string, prompt: string) {
		await this.openai.beta.threads.messages.create(threadId, {
			role: "user",
			content: prompt,
			file_ids: [],
		});

		const runStatus = await this.createRun(assistantId, threadId);

		const messages = await this.openai.beta.threads.messages.list(threadId);

		const lastMessageForRun = messages.data
			.filter((message) => message.run_id === runStatus.id && message.role === "assistant").pop();

		if (lastMessageForRun && lastMessageForRun.content[0].type === 'text') {
			return `${lastMessageForRun.content[0].text.value}`;
		} else if (lastMessageForRun && lastMessageForRun.content[0].type === 'image_file') {
			return `${lastMessageForRun.content[0].image_file.file_id}`;
		} else if (!["failed", "cancelled", "expired"].includes(runStatus.status)) {
			return null;
		}
	}

	async uploadFile(filePath: string, purpose: string = 'assistants') {
		const fileName = filePath.split('/').pop();
		const files = await this.openai.files.list();
		const existingFile = files.data.find((file) => file.filename === fileName);
		if (existingFile) {
			return existingFile.id;
		}
		try {
			const file = await this.openai.files.create({
				file: fs.createReadStream(filePath), purpose: 'assistants'
			});
			return file.id;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	sendStreamPrompt(prompt: string, messages = [], engine = 'gpt-4-1106-preview', temperature = 0.8, maxTokens = 4095, topP = 0.8, frequencyPenalty = 0, presencePenalty = 0): ChatCompletionStream {
		return this.openai.beta.chat.completions.stream({
			model: engine,
			messages: [...messages, {role: 'user', content: prompt}],
			temperature,
			max_tokens: maxTokens,
			top_p: topP,
			frequency_penalty: frequencyPenalty,
			presence_penalty: presencePenalty,
		});
	}

	static getInstance() {
		if (!OpenaiService.instance) {
			OpenaiService.instance = new OpenaiService();
		}
		return OpenaiService.instance;
	}
}

export default OpenaiService;