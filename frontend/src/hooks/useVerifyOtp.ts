import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../constants/apiEndPoints";

export const useVerifyOtp = (email: string) => {
  const [otp, setOtp] = useState("");
  const [loading, setloading] = useState(false);
  const handleVerifyOtp = async () => {
    try {
      setloading(true);
      const { data } = await axios.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });
  

      return data;
    } finally {
      setloading(false);
    }
  };

  return { handleVerifyOtp, otp, loading,  setOtp };
};
