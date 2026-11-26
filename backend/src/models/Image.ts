import mongoose, { Document, Schema, Types } from "mongoose";
export interface IImage extends Document {
  user: Types.ObjectId;
  title: string;
  imageUrl: string;
  publicId?: string;
  order: number;
}

const imageSchema = new Schema<IImage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User refference is required"],
    },
    title: { type: String, required: [true, "Image title is required"] },
    imageUrl: { type: String, required: [true, "Image url is required"] },
    publicId: { type: String },
    order: { type: Number, default: 0, min: [0, "Order cannot be negative"] },
  },
  { timestamps: true },
);

export default mongoose.model<IImage>("Image", imageSchema);
