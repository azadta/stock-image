export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  AUTH: {
    LOGIN: `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
    REGISTER: `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
    RESET_PASSWORD: `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
    FORGOT_PASSWORD: `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
    VERIFY_OTP: `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
  },
  IMAGES: {
    BASE: `${import.meta.env.VITE_API_BASE_URL}/api/images`,
    UPLOAD: `${import.meta.env.VITE_API_BASE_URL}/api/images/upload`,
    REARRANGE: `${import.meta.env.VITE_API_BASE_URL}/api/images/rearrange`,
    SPECIFIC: (id: string) =>
      `${import.meta.env.VITE_API_BASE_URL}/api/images/${id}`,
  },
} as const;
