import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { id: string };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
