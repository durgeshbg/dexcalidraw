import { Router } from 'express';
import { signupController, signinController } from '../controllers/users';

const router: Router = Router();

router.post('/signup', signupController);
router.post('/signin', signinController);

export default router;
