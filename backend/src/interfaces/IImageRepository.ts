import { IImage } from "../models/Image";

export interface IImageRepository {
  findByUser(userId: string): Promise<IImage[]>;
  createMany(data: Partial<IImage>[]): Promise<IImage[]>;
  update(
    imageId: string,
    userId: string,
    data: Partial<IImage>,
  ): Promise<IImage | null>;

  delete(imageId: string, userId: string): Promise<IImage | null>;
  rearrange(userId: string, orderIds: string[]): Promise<void>;
  findByIdAndUser(imageId: string, userId: string): Promise<IImage | null>;
}
