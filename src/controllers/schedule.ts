import prisma from '../client';
import { Request, Response } from 'express';
import { Client as QLDTClient } from '@notekunn/qldt-kma';
import { CustomRequest } from '../@types';
import { Account, Schedule } from '@prisma/client';
import moment from 'moment-timezone';
const TIME_ZONE = process.env.TIME_ZONE || 'Asia/Ho_Chi_Minh';
export default class ScheduleController {
	async showSemesters(req: CustomRequest<Account>, res: Response) {
		try {
			const account = <Account>req.data;
			const qldt = new QLDTClient();
			await qldt.login(account.cookie);
			const semesters = await qldt.showSemesters();
			res.send({
				message: 'Get semesters success!',
				data: semesters,
			});
		} catch (error) {
			res.status(400).send({
				error: error.message,
			});
		}
	}
	async saveSchedule(req: CustomRequest<Account>, res: Response) {
		try {
			const qldt = new QLDTClient();
			const { semester } = req.body;
			const account = <Account>req.data;
			await qldt.login(account.cookie);
			await qldt.showSemesters();
			const schedules = await qldt.showTimeTable(semester);
			if (!schedules || schedules.length == 0) throw new Error('No schedule yet!');
			const schedule = schedules[0];
			const isExist = await prisma.schedule.count({
				where: {
					AND: {
						day: schedule.day,
						lesson: schedule.lesson,
						studentCode: account.studentCode,
					},
				},
			});
			if (!!isExist) {
				res.send({
					message: 'Schedule saved before!',
					data: schedules,
				});
				return;
			}
			const dataCreate: Schedule[] = schedules.map((e) => {
				const schedule: Schedule = {
					...e,
					studentCode: account.studentCode,
				};
				return schedule;
			});
			await prisma.schedule.createMany({
				data: dataCreate,
			});
			res.send({
				message: 'Schedule saved success!',
				data: dataCreate,
				skipDuplicates: true,
			});
		} catch (error) {
			res.status(400).send({
				error: error.message,
			});
		}
	}
	async searchSchedule(req: Request, res: Response) {
		try {
			const { studentCode, days } = req.body;
			if (!days && !Array.isArray(days)) throw new Error('Ngày tra cứu không hợp lệ (DD/MM/YYYY)');
			const schedules = await prisma.schedule.findMany({
				where: {
					studentCode,
					day: {
						in: days,
					},
				},
			});
			res.send({
				message: 'Get schedules success',
				data: schedules.sort(this.sortSchedule),
			});
		} catch (error) {
			res.status(error.statusCode || 400).send({
				error: error.message,
			});
		}
	}
	sortSchedule(a: Schedule, b: Schedule) {
		if (moment(a.day, 'DD/MM/YYYY').isAfter(moment(b.day, 'DD/MM/YYYY'))) return 1;
		const aFirstLesson = parseInt(a.lesson, 10);
		const bFirstLesson = parseInt(b.lesson, 10);
		console.log(aFirstLesson, bFirstLesson);
		if (aFirstLesson > bFirstLesson) return 1;
		return -1;
	}
}
