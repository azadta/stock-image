import mongoose, { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  password: string;
  isEmailVerified: boolean;
  otpHash: string | null;
  otpExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetTokenExpiry: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
export default mongoose.model<IUser>("User", userSchema);
