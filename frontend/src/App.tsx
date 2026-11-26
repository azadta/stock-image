import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
const TOKEN_STORAGE_KEY = "token";

function App() {
  const [token, setToken] = useState<string>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || "",
  );
  const resetToken = new URLSearchParams(window.location.search).get("token");
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Toaster position="top-right" richColors />
      {resetToken ? (
        <ResetPassword />
      ) : token ? (
        <Dashboard token={token} setToken={setToken} />
      ) : (
        <AuthPage setToken={setToken} />
      )}
    </div>
  );
}

export default App;
