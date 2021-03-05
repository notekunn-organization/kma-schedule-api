import { Router } from 'express';
import AccountController from '../controllers/account';
const router = Router();
const controller = new AccountController();
router.get('/', (req, res, next) => {
	res.status(403).send({
		error: "You don't allowed to visit here",
	});
});
router.post('/login', controller.login);
export default router;
