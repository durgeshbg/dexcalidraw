import { Router } from 'express';
import {
  signupController,
  signinController,
  getUserInfo,
  getUsers,
} from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';

const router: Router = Router();

router.get('/', authMiddleware, getUsers);
router.get('/me', authMiddleware, getUserInfo);
router.post('/signup', signupController);
router.post('/signin', signinController);

export default router;
