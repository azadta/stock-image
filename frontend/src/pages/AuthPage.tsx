import { useState } from "react";
import type { ViewMode } from "../types";
import Login from "../components/Login";
import Register from "../components/Register";
import VerifyOtp from "../components/VerifyOtp";

interface AuthPageProps {
  setToken: (token: string) => void;
}

const AuthPage = ({ setToken }: AuthPageProps) => {
  const [view, setView] = useState<ViewMode>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-around mb-6 border-b pb-2">
          <button
            type="button"
            onClick={() => setView("login")}
            className={`font-semibold pb-1 ${view === "login" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setView("register")}
            className={`font-semibold pb-1 ${view === "register" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          >
            Register
          </button>
        </div>

        {view === "login" && <Login setToken={setToken} />}

        {view === "register" && (
          <Register setView={setView} setPendingEmail={setPendingEmail} />
        )}
        {view === "verify" && (
          <VerifyOtp email={pendingEmail} setView={setView} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
