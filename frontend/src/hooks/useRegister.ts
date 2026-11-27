import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../constants/apiEndPoints";

export const useRegister = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setloading] = useState(false);

  const handleRegister = async () => {
    try {
      setloading(true);
      const { data } = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        phone,
        password,
      });
      return data;
    } finally {
      setloading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    handleRegister,
    loading
  };
};
