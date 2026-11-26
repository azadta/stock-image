import type { ViewMode } from "../types";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";
import type { FormEvent } from "react";

interface VerifyOtpProps {
  email: string;
  setView: (view: ViewMode) => void;
}

const VerifyOtp = ({ email, setView }: VerifyOtpProps) => {
  const { handleVerifyOtp, loading, otp, setOtp } = useVerifyOtp(email);

  const verifyUserOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await handleVerifyOtp();
      toast.success(data.message);
      setView("login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
    }
  };

  return (
    <form onSubmit={verifyUserOtp} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Verify your email</h2>
      <p className="text-sm text-gray-500 text-center">
        Enter the six digit otp send to {email}
      </p>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="w-full p-2 border rounded text-center tracking-widest"
      />
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Verifying" : "Verify OTP"}
      </button>
    </form>
  );
};

export default VerifyOtp;
