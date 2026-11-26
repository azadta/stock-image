const API_BASE_URL = "http://localhost:5000";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    VERIFY_OTP:`${API_BASE_URL}/api/auth/verify-otp`
  },
  IMAGES: {
    BASE: `${API_BASE_URL}/api/images`,
    UPLOAD: `${API_BASE_URL}/api/images/upload`,
    REARRANGE: `${API_BASE_URL}/api/images/rearrange`,
    SPECIFIC: (id: string) => `${API_BASE_URL}/api/images/${id}`,
  },
} as const
