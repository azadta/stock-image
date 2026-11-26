import type { FormEvent } from "react";
import { useResetPassword } from "../hooks/useResetPassword";

const ResetPassword = () => {
  const token = new URLSearchParams(window.location.search).get(
    "token",
  ) as string;
  const {
    confirmPassword,
    loading,
    password,
    resetPasswordHandler,
    setConfirmPassword,
    setPassword,
  } = useResetPassword(token);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => resetPasswordHandler(e)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
     
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50 "
        >
          {loading ? "Updating" : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
