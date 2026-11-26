export const ENDPOINTS = {
  AUTH: {
    BASE: "/api/auth",
    REGISTER: "/register",
    LOGIN: "/login",
    RESET_PASSWORD: "/reset-password",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY_OTP:'/verify-otp'
  },
  IMAGES: {
    BASE: "/api/images",
    UPLOAD: "/upload",
    REARRANGE: "/rearrange",
    BY_ID: "/:id",
  },
  UPLOADS: {
    STATIC_ROUTE: "/uploads",
    DIRECTORY: "uploads",
  } as const,
};
