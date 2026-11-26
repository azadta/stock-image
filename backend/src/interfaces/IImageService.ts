import { IImage } from "../models/Image";
import { UpdateImageInput, UploadedAssetInput } from "./IImage";

export interface IImageService {
  getImages(userId: string): Promise<IImage[]>;
  uploadImages(
    userId: string,
    uploadedImages: UploadedAssetInput[],
    titles: string[],
  ): Promise<IImage[]>;
  updateImage(
    imageId: string,
    userId: string,
    updates: UpdateImageInput,
  ): Promise<IImage>;

  deleteImage(imageId: string, userId: string): Promise<void>;
  rearrangeImages(userId: string, orderIds: string[]): Promise<void>;
}
