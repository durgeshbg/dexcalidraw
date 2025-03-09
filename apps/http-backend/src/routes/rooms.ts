import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createRoom, getUserRooms, deleteRoom, getRoom, addUserToRoom, removeUserFromRoom } from '../controllers/rooms';
import { getAllMessages, createMessage } from '../controllers/messages';

const router: Router = Router();

router.use(authMiddleware);
router.get('/', getUserRooms);
router.post('/', createRoom);
router.get('/:roomId', getRoom);
router.delete('/:roomId', deleteRoom);
// Users
router.post('/:roomId/users', addUserToRoom);
router.delete('/:roomId/users', removeUserFromRoom);
// Messages
router.get('/:roomId/messages', getAllMessages);
router.post('/:roomId/messages', createMessage);

export default router;
