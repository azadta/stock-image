import { Router } from "express";
import { ENDPOINTS } from "../constants/endpoints";
import container from "../containers/container";
import { AuthController } from "../controllers/authController";
import { Types } from "../types/Types";

const router = Router();

const authController = container.get<AuthController>(Types.AuthController);
router.post(ENDPOINTS.AUTH.REGISTER, authController.register);
router.post(ENDPOINTS.AUTH.VERIFY_OTP, authController.verifyOtp);
router.post(ENDPOINTS.AUTH.LOGIN, authController.login);
router.post(
  ENDPOINTS.AUTH.RESET_PASSWORD,
  authController.completeResetPassword,
);
router.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, authController.forgotPassword);

export default router;
