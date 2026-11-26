import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { UpdateImageInput, UploadedAssetInput } from "../interfaces/IImage";
import type { IImageRepository } from "../interfaces/IImageRepository";
import { IImageService } from "../interfaces/IImageService";
import { IImage } from "../models/Image";
import { Types } from "../types/Types";
import { AppError } from "../utils/AppError";

@injectable()
export class ImageService implements IImageService {
  constructor(
    @inject(Types.ImageRepository) private imageRepository: IImageRepository,
  ) {}
  async getImages(userId: string): Promise<IImage[]> {
    return this.imageRepository.findByUser(userId);
  }
  async uploadImages(
    userId: string,
    uploadedImages: UploadedAssetInput[],
    titles: string[],
  ): Promise<IImage[]> {
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new AppError(MESSAGES.NO_IMAGES_UPLOADED, STATUS_CODES.BAD_REQUEST);
    }

    const imageDocs = uploadedImages.map((item, idx) => ({
      user: userId,
      title: titles?.[idx]?.trim() || `Image ${idx + 1}`,
      imageUrl: item.secureUrl,
      publicId: item?.publicId,
      order: Date.now() + idx,
    }));
    return this.imageRepository.createMany(imageDocs as unknown as IImage[]);
  }

  async updateImage(
    imageId: string,
    userId: string,
    updates: UpdateImageInput,
  ): Promise<IImage> {
    const image = await this.imageRepository.findByIdAndUser(imageId, userId);
    if (!image) {
      throw new AppError(MESSAGES.IMAGE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    if (updates.title !== undefined) {
      image.title = updates.title;
    }
    if (updates.imageUrl) {
      image.imageUrl = updates.imageUrl;
      if (updates.publicId) {
        image.publicId = updates.publicId;
      }
    }

    return await image.save();
  }

  async deleteImage(imageId: string, userId: string): Promise<void> {
    const deleted = await this.imageRepository.delete(imageId, userId);
    if (!deleted) {
      throw new AppError(
        MESSAGES.IMAGE_NOT_FOUND_OR_UNAUTHORIZED,
        STATUS_CODES.NOT_FOUND,
      );
    }
  }

  async rearrangeImages(userId: string, orderIds: string[]): Promise<void> {
    await this.imageRepository.rearrange(userId, orderIds);
  }
}
