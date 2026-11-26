import { Request } from "express";
import "multer";
import multer from "multer";
declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      files: Multer.File[];
    }
  }
}
