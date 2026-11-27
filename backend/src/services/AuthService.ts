import { inject, injectable } from "inversify";
import { IAuthService } from "../interfaces/IAuthService";
import jwt from "jsonwebtoken";

import type { IUserRepository } from "../interfaces/IUserRepository";
import { Types } from "../types/Types";
import { AppError } from "../utils/AppError";
import { generateOtp, hashOtp } from "../utils/otp";
import bcrypt from "bcryptjs";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import{ sendResendEmail} from "../utils/sendResendEmail";
import {
  generateResetPasswordToken,
  hashResetToken,
} from "../utils/generatePasswordResetToken";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "1d";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository,
  ) {}
  async register(data: {
    email: string;
    password: string;
    phone: string;
  }): Promise<void> {
    const { email, password, phone } = data;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser?.isEmailVerified) {
      throw new AppError(MESSAGES.USER_EXISTS, STATUS_CODES.BAD_REQUEST);
    }
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const userData = {
      phone,
      password: hashedPassword,
      isEmailVerified: false,
      otpHash: hashedOtp,
      otpExpiry,
    };
    if (existingUser) {
      await this.userRepository.updateRegistration(email, userData);
    } else {
      await this.userRepository.create({ email, ...userData });
    }
    const message = `<h2>Email Verification<h2>
        <p>Your OTP for registration is :</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        <p>Please do not share this OTP with anyone</p>`;
    await sendResendEmail({
      to: email,
      subject: `Stock Image- Email verification`,
      message,
    });
  }

  async login(data: { email: string; password: string }): Promise<{
    token: string;
    user: { id: string; email: string; phone: string };
  }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(
        MESSAGES.INVALID_CREDENTIALS,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!user.isEmailVerified) {
      throw new AppError(MESSAGES.VERIFY_EMAIL_FIRST, STATUS_CODES.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError(
        MESSAGES.INVALID_CREDENTIALS,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: TOKEN_EXPIRY,
      },
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    const resetToken = generateResetPasswordToken();
    const hashedToken = hashResetToken(resetToken);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.setPasswordResetToken(email, hashedToken, expiry);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const message = `<h2>Password Reset</h2>
     <p>Click the link below to reset your password:</p>
     <a href="${resetLink}">Reset Password</a>
     <p>This link expires in 15 minutes</p>
    `;
    await sendResendEmail({
      to: user.email,
      subject: "Stock Image - Password Reset",
      message,
    });
  }
  async completeResetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const hashedToken = hashResetToken(token);
    const user = await this.userRepository.findByValidResetToken(hashedToken);
    if (!user) {
      throw new AppError(
        MESSAGES.INVALID_OR_EXPIRED_LINK,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.userRepository.updatePassword(
      user._id.toString(),
      hashedPassword,
    );
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new AppError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (user.isEmailVerified)
      throw new AppError(
        MESSAGES.EMAIL_ALREADY_VERIFIED,
        STATUS_CODES.BAD_REQUEST,
      );
    if (user.otpExpiry!.getTime() < Date.now()) {
      throw new AppError(MESSAGES.OTP_EXPIRED, STATUS_CODES.BAD_REQUEST);
    }
    const hashedOtp = hashOtp(otp);
    if (hashedOtp !== user.otpHash)
      throw new AppError(MESSAGES.INVALID_OTP, STATUS_CODES.BAD_REQUEST);
    await this.userRepository.verifyEmail(user._id.toString());
  }
}
