import { Router } from 'express';
import { signupController, signinController, getUserInfo } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';

const router: Router = Router();

router.post('/signup', signupController);
router.post('/signin', signinController);
router.post('/me', authMiddleware, getUserInfo);

export default router;
