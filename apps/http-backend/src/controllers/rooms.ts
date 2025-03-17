import { prisma } from '@dexcalidraw/database';
import { Request, Response } from 'express';
import z from 'zod';

export const roomSchema = z.object({
  name: z.string().min(4),
});

export const createRoom = async (req: Request, res: Response) => {
  const { success, error, data } = roomSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json({ error });
    return;
  }

  const { name } = data;
  const room = await prisma.room.create({
    data: { name, adminId: req.user?.id! },
  });
  res.status(201).json({ room });
  return;
};

export const getUserRooms = async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { adminId: req.user?.id },
        { users: { some: { id: req.user?.id } } },
      ],
    },
  });
  res.status(200).json({ rooms });
  return;
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  if (room.adminId !== req.user?.id) {
    res.status(403).json({ error: 'You are not allowed to delete this room' });
    return;
  }
  await prisma.room.delete({ where: { id: roomId } });
  res.status(200).json({ message: 'Room deleted' });
  return;
};

export const getRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { users: true, messages: true },
  });

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  res.status(200).json({ room });
  return;
};

export const addUserToRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.body;
  if (!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  if (room.adminId !== req.user?.id) {
    res
      .status(403)
      .json({ error: 'You are not allowed to add users to this room' });
    return;
  }

  await prisma.room.update({
    where: { id: roomId },
    data: { users: { connect: { id: userId } } },
  });

  res.status(200).json({ message: 'User added to room' });
  return;
};

export const removeUserFromRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userId } = req.body;
  if (!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  if (room.adminId !== req.user?.id) {
    res
      .status(403)
      .json({ error: 'You are not allowed to remove users from this room' });
    return;
  }

  await prisma.room.update({
    where: { id: roomId },
    data: { users: { disconnect: { id: userId } } },
  });

  res.status(200).json({ message: 'User removed from room' });
  return;
};
