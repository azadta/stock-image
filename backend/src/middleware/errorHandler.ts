import { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let errorMessage: string = MESSAGES.INTERNAL_SERVER_ERROR;
  let errorStack: string | undefined = undefined;
  if (err instanceof AppError) {
    console.error(err.message);
    statusCode = err.statusCode;
    errorMessage = err.message;
    errorStack = process.env.NODE_ENV === "production" ? undefined : err.stack;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = STATUS_CODES.BAD_REQUEST;
    errorMessage = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = STATUS_CODES.BAD_REQUEST;
    errorMessage = err.message;
  } else if (err instanceof Error) {
    console.error(err.message);
    errorStack = process.env.NODE_ENV === "production" ? undefined : err.stack;
  }
  res.status(statusCode).json({
    message: errorMessage,
    stack: errorStack,
  });
};
