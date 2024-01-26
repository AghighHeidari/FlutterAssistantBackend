import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {errors} from "./consts/errors.ts";
import {extendMorganTokens} from "./utils/morgan-tokens.ts";
import {handleResponse} from "./utils/response-handler.ts";
import openaiRouter from "./router/openai-router.js";
import authRouter from "./router/auth-router.js";

extendMorganTokens();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :errors'));
app.use(cors());

app.get('/', (req, res) => {
	res.json({success: true, message: `Server is up and running! ${new Date().toISOString()}`});
});

app.use('/auth', authRouter);
app.use('/openai', openaiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.dir('Error caught in client err_func', {colors: true});
	console.dir(err, {colors: true});
	console.dir({url: req.originalUrl, body: req.body}, {colors: true});
	return handleResponse(req, res, {success: false, error: errors.INTERNAL_SERVER_ERROR});
});

app.listen(process.env.NODE_APP_PORT || 3001, () => console.log(`Server running on port ${process.env.NODE_APP_PORT || 3001}`));
