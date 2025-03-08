import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createRoom, getUserRooms, deleteRoom, getRoom, addUserToRoom, removeUserFromRoom } from '../controllers/rooms';

const router: Router = Router();

router.use(authMiddleware);
router.get('/', getUserRooms);
router.post('/', createRoom);
router.get('/:roomId', getRoom);
router.delete('/:roomId', deleteRoom);
router.post('/:roomId/users', addUserToRoom);
router.delete('/:roomId/users', removeUserFromRoom);
export default router;
