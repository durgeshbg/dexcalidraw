import { JwtPayload, verify } from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch (err) {
    if (err) {
      console.log('Token verification failed', err);
      return false;
    }
  }
};
