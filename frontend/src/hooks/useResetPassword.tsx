import { useState, type FormEvent } from "react";
import { API_ENDPOINTS } from "../constants/apiEndPoints";
import axios from "axios";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";

export const useResetPassword = (token: string) => {
  const [password, setPassword] = useState<string>("");

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error(MESSAGES.ERROR.INVALID_PASSWORD_RESET_LINK);
      return;
    }
    if (password !== confirmPassword) {
      toast.error(MESSAGES.ERROR.MISMATCH_PASSWORD);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword: password,
      });
      console.log("data from reset Password", data);
      toast.success(data.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPasswordHandler,
    loading,
    setPassword,
    password,
    setConfirmPassword,
    confirmPassword,
  };
};
