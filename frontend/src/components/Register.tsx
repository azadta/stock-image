import { type FormEvent } from "react";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";
import { useRegister } from "../hooks/useRegister";
import type { ViewMode } from "../types";

interface RegisterProps {
  setView: (view: ViewMode) => void;
  setPendingEmail: (email: string) => void;
}

const Register = ({ setView, setPendingEmail }: RegisterProps) => {
  const {
    email,
    handleRegister,
    password,
    phone,
    setEmail,
    setPassword,
    setPhone,
    loading,
  } = useRegister();
  const registerUser = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const data = await handleRegister();
      toast.success(data.message);
      setPendingEmail(email);

      setView("verify");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
    }
  };

  return (
    <form onSubmit={registerUser} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Create Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 "
      >
        {loading ? "Uploading..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
