import { prisma } from '@dexcalidraw/database/client';
import { Request, Response } from 'express';
import z, { any } from 'zod';

export const shapeSchema = z.object({
  data: any(),
});

export const createShape = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { success, error, data } = shapeSchema.safeParse(req.body);

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
  const { data: shapeData } = data;
  const shape = await prisma.shape.create({
    data: { data: shapeData, roomId: room.id },
  });
  res.status(201).json({ shape });
};

export const getAllShapes = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  const shapes = await prisma.shape.findMany({
    where: { roomId },
  });
  res.status(200).json({ shapes });
  return;
};

export const deleteShape = async (req: Request, res: Response) => {
  const { roomId, shapeUUID } = req.params;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  const shapes = await prisma.shape.findMany({
    where: { roomId },
  });
  shapes.forEach((shape) => {
    const parsedData = shape.data as any;

    if (parsedData.uuid === shapeUUID) {
      prisma.shape
        .delete({
          where: { id: shape.id },
        })
        .then((shape) => {
          res.status(200).json({ shape });
        });
      return;
    }
  });
};
