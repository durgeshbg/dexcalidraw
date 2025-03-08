import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@dexcalidraw/database';
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
    res.status(500).json({ error: 'An error occurred while creating the user' });
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
    const passwordMatch = bcrypt.compare(password, user.password);
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
    select: { name: true, email: true, adminRooms: { select: { name: true } }, rooms: { select: { name: true } } },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(user);
};
