import { Router } from 'express';
import { signupController, signinController, getUserInfo } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';

const router: Router = Router();

router.get('/me', authMiddleware, getUserInfo);
router.post('/signup', signupController);
router.post('/signin', signinController);

export default router;
