import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
  createRoom,
  getUserRooms,
  deleteRoom,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
} from '../controllers/rooms';
import { getAllMessages, createMessage } from '../controllers/messages';
import { getAllShapes, createShape, deleteShape } from '../controllers/shapes';

const router: Router = Router();

router.use(authMiddleware);
router.get('/', getUserRooms);
router.post('/', createRoom);
router.get('/:roomId', getRoom);
router.delete('/:roomId', deleteRoom);
// Users
router.post('/:roomId/users', addUserToRoom);
router.put('/:roomId/users', removeUserFromRoom);
// Messages
router.get('/:roomId/messages', getAllMessages);
router.post('/:roomId/messages', createMessage);
// Shapes
router.get('/:roomId/shapes', getAllShapes);
router.post('/:roomId/shapes', createShape);
router.delete('/:roomId/shapes/:shapeUUID', deleteShape);

export default router;
