import { Request } from 'express';

export interface CustomError extends Error {
	statusCode?: number;
}
export interface CustomRequest<T> extends Request {
	data?: T;
}
