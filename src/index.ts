import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import indexRouter from './routes/index';
import accountRouter from './routes/account';
import scheduleRouter from './routes/schedule';
import { CustomError } from './@types';
const app = express();
app.use(express.json());
dotenv.config();

const { PORT } = process.env;
app.use('/', indexRouter);
app.use('/accounts', accountRouter);
app.use('/schedules', scheduleRouter);
app.use('*', (req, res, next) => {
	const error: CustomError = new Error('404 Not found');
	error.statusCode = 404;
	next(error);
});
app.use((error: CustomError, req: Request, res: Response) => {
	res.status(error.statusCode || 400).send({
		error: error.message || 'Some thing wrong!',
		// stack: error.stack,
	});
});
app.listen(PORT, () => {
	console.log('Listening in port %d', PORT);
});
