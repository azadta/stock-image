import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../constants/messages";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: MESSAGES.ACCESS_DENIED_NO_TOKEN });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: MESSAGES.INVALID_OR_EXPIRED_TOKEN });
  }
};
