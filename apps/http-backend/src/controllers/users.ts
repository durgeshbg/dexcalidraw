import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@dexcalidraw/database/client';
import dotenv from 'dotenv';
dotenv.config();

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupController = async (req: Request, res: Response) => {
  const { success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error });
    return;
  }
  try {
    const { name, email, password } = req?.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Email already exists' });
  }
  return;
};
export const signinController = async (req: Request, res: Response) => {
  const { success, error } = signinSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error });
    return;
  }
  try {
    const { email, password } = req?.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while signing in' });
  }
  return;
};

export const getUserInfo = async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: { id: req.user?.id },
    select: {
      name: true,
      email: true,
      adminRooms: { select: { name: true, id: true } },
      rooms: { select: { name: true, id: true } },
    },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const s = req?.query?.s as string;
  if (s) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: s, mode: 'insensitive' } },
          { name: { contains: s, mode: 'insensitive' } },
        ],
        id: { not: req.user?.id },
      },
      select: { name: true, id: true, email: true },
    });
    res.status(200).json({ users });
    return;
  } else {
    const users = await prisma.user.findMany({
      select: { name: true, id: true, email: true },
    });
    res.status(200).json({ users });
  }
};
