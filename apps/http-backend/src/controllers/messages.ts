import { prisma } from '@dexcalidraw/database';
import { Request, Response } from 'express';
import z from 'zod';

export const roomSchema = z.object({
  content: z.string(),
});

export const createMessage = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { success, error, data } = roomSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error });
    return;
  }
  const room = await prisma.room.findUnique({
    where: { id: roomId, users: { some: { id: req.user?.id } } },
    select: { users: true, id: true },
  });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  const { content } = data;
  const message = await prisma.message.create({
    data: { content, authorId: req.user?.id!, roomId: room.id },
  });
  res.status(201).json({ message });
};

export const getAllMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  const messages = await prisma.message.findMany({
    where: { roomId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  res.status(200).json({ messages });
  return;
};
