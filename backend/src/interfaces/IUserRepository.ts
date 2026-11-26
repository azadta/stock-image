import { IUser } from "../models/User";

export interface IUserRepository {
  findByEmail: (email: string) => Promise<IUser | null>;
  create(data: Partial<IUser>): Promise<IUser | null>;
  updateRegistration(
    email: string,
    data: Partial<IUser>,
  ): Promise<IUser | null>;
  setPasswordResetToken(
    email: string,
    hashedToken: string,
    expiry: Date,
  ): Promise<void>;
  findByValidResetToken(hashedToken: string): Promise<IUser | null>;
  updatePassword(userId: string, password: string): Promise<void>;
  verifyEmail(userId: string): Promise<void>;
}
