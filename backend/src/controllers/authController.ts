import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import type { IAuthService } from "../interfaces/IAuthService";
import { Types } from "../types/Types";

@injectable()
export class AuthController {
  constructor(@inject(Types.AuthService) private authService: IAuthService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.register(req.body);
      res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(STATUS_CODES.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.forgotPassword(req.body.email);
      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.SENT_PASSWORD_RESET_LINK });
    } catch (error) {
      next(error);
    }
  };

  completeResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.completeResetPassword(token, newPassword);
      res
        .status(STATUS_CODES.OK)
        .json({ message: MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      await this.authService.verifyOtp(email, otp);
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.EMAIL_VERIFIED });
    } catch (error) {
      next(error);
    }
  };
}
