import { type FormEvent } from "react";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";
import { useLogin } from "../hooks/useLogin";

interface LoginProps {
  setToken: (token: string) => void;
}

const Login = ({ setToken }: LoginProps) => {
  const {
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    isForgotPassword,
    handleForgotPassword,
    setIsForgotPassword,
    loading,
  } = useLogin();
  const loginUser = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const data = await handleLogin();

      setToken(data.token);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
    }
  };

  return (
    <div>
      {isForgotPassword ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <h2 className="text-xl font-bold text-center">Forgot Password</h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your registered email address. We wil send you a password
            reset link.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="text-sm text-gray-600 p-2 hover:underline w-full text-center"
          >
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={loginUser} className="space-y-4">
          <h2 className="text-xl font-bold text-center">Welcome Back</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="text-sm text-blue-600 p-2 hover:underline w-full text-center"
          >
            Forgot Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
