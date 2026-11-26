import { injectable } from "inversify";
import { IUserRepository } from "../interfaces/IUserRepository";
import User, { IUser } from "../models/User";

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
  async create(data: Partial<IUser>): Promise<IUser | null> {
    return User.create(data);
  }

  async updateRegistration(
    email: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate({ email }, { $set: data }, { new: true });
  }
  async setPasswordResetToken(
    email: string,
    hashedToken: string,
    expiry: Date,
  ): Promise<void> {
    await User.updateOne(
      { email },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetTokenExpiry: expiry,
        },
      },
    );
  }
  async findByValidResetToken(hashedToken: string): Promise<IUser | null> {
    return User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: new Date() },
    });
  }
  async updatePassword(userId: string, password: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password,
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
        },
      },
    );
  }

  async verifyEmail(userId: string): Promise<void> {
    await User.updateOne(
      { _id: userId },
      { $set: { isEmailVerified: true, otpHash: null, otpExpiry: null } },
    );
  }
}
