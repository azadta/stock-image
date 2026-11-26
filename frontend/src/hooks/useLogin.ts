import { useState, type FormEvent } from "react";
import { API_ENDPOINTS } from "../constants/apiEndPoints";
import axios from "axios";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isReset, setIsReset] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    const res = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  };
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      toast.success(data.message);
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        newPassword,
      });
      toast.success(res.data.messages);
      setIsReset(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    }
  };

  return {
    handleLogin,
    handleReset,
    email,
    setEmail,
    password,
    setPassword,
    newPassword,
    setNewPassword,
    isReset,
    setIsReset,
    isForgotPassword,
    setIsForgotPassword,
    handleForgotPassword,
    loading
  };
};
