import { injectable } from "inversify";
import { IImageRepository } from "../interfaces/IImageRepository";
import Image, { IImage } from "../models/Image";

@injectable()
export class ImageRepository implements IImageRepository {
  async findByUser(userId: string): Promise<IImage[]> {
    return Image.find({ user: userId }).sort({ order: 1 });
  }
  async createMany(data: Partial<IImage>[]): Promise<IImage[]> {
    return Image.insertMany(data) as unknown as Promise<IImage[]>;
  }
  async update(
    imageId: string,
    userId: string,
    data: Partial<IImage>,
  ): Promise<IImage | null> {
    return Image.findOneAndUpdate(
      { _id: imageId, user: userId },
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async delete(imageId: string, userId: string): Promise<IImage | null> {
    return Image.findOneAndDelete({ _id: imageId, user: userId });
  }

  async rearrange(userId: string, orderIds: string[]): Promise<void> {
    const operations = orderIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: userId },
        update: { $set: { order: index } },
      },
    }));
    if (operations.length > 0) {
      await Image.bulkWrite(operations);
    }
  }
  async findByIdAndUser(
    imageId: string,
    userId: string,
  ): Promise<IImage | null> {
    return Image.findOne({ _id: imageId, user: userId });
  }
}
