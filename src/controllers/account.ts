import prisma from '../client';
import { Request, Response } from 'express';
import { Client as QLDTClient } from '@notekunn/qldt-kma';
import { CustomRequest } from '../@types';
import { Account } from '@prisma/client';
export default class AccountController {
	async login(req: Request, res: Response) {
		const { studentCode, password } = req.body;
		try {
			if (!studentCode || !password) throw new Error('Please input student code and password');
			const qldt = new QLDTClient();
			const isLogin = await qldt.login(studentCode, password, true);
			if (!isLogin) throw new Error('Student code or password not correct');
			const cookie = qldt.getCookie();
			await prisma.account.upsert({
				create: {
					studentCode,
					password,
					cookie,
				},
				update: {
					password,
					cookie,
				},
				where: {
					studentCode: studentCode,
				},
			});
			res.send({
				message: 'Login success!',
			});
		} catch (error) {
			res.status(error.statusCode || 400).send({
				error: error.message || 'Some thing wrong!',
			});
		}
	}
	async validateAccount(req: CustomRequest<Account>, res: Response, next: Function) {
		try {
			const { studentCode } = req.body;
			const qldt = new QLDTClient();
			const account = await prisma.account.findUnique({
				where: {
					studentCode,
				},
			});
			if (!account || !account.password) throw new Error('Please login to system');
			req.data = account;
			const loginCookie = await qldt.login(account.cookie);
			if (loginCookie) return next();
			const loginAccount = await qldt.login(account.studentCode, account.password);
			if (loginAccount) {
				req.data = await prisma.account.update({
					where: {
						studentCode,
					},
					data: {
						cookie: qldt.getCookie(),
					},
				});
				return next();
			}
			await prisma.account.update({
				where: {
					studentCode,
				},
				data: {
					password: '',
					cookie: '',
				},
			});
			throw new Error('Password is not correct');
		} catch (error) {
			res.status(400).send({
				error: error.message,
			});
		}
	}
}
