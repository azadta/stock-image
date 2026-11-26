import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";

import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import type { IImageService } from "../interfaces/IImageService";
import { Types } from "../types/Types";

@injectable()
export class ImageController {
  constructor(
    @inject(Types.ImageService) private imageService: IImageService,
  ) {}
  getImages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const images = await this.imageService.getImages(req.user?.id as string);
      res.status(STATUS_CODES.OK).json(images);
    } catch (error) {
      next(error);
    }
  };

  uploadImages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { titles, images: uploadedImages } = req.body;

      const created = await this.imageService.uploadImages(
        req.user?.id as string,
        uploadedImages,
        titles,
      );

      res.status(STATUS_CODES.CREATED).json(created);
    } catch (error) {
      next(error);
    }
  };

  updateImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, imageUrl, publicId } = req.body;

      const updated = await this.imageService.updateImage(
        req.params.id as string,
        req.user?.id as string,
        { title, imageUrl, publicId },
      );

      res.status(STATUS_CODES.OK).json(updated);
    } catch (error) {
      next(error);
    }
  };
  deleteImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.imageService.deleteImage(
        req.params.id as string,
        req.user?.id as string,
      );

      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.IMAGE_DELETED_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  rearrangeImages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orderedIds } = req.body;
      await this.imageService.rearrangeImages(
        req.user?.id as string,
        orderedIds,
      );
      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.ORDER_UPDATED_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}
