export interface IAuthService {
  register(data: {
    email: string;
    password: string;
    phone: string;
  }): Promise<void>;
  login(data: { email: string; password: string }): Promise<{
    token: string;
    user: { id: string; email: string; phone: string };
  }>;

  forgotPassword(email: string): Promise<void>;
  completeResetPassword(token: string, newPassword: string): Promise<void>;
  verifyOtp (email: string, otp: string):Promise<void>;
}
