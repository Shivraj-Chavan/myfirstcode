import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { ENDPOINTS } from "../api/endpoints.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
  try {
    const raw = localStorage.getItem("mfc_user");

    if (!raw || raw === "undefined") {
      return null;
    }

    return JSON.parse(raw);
  } catch (err) {
    localStorage.removeItem("mfc_user");
    return null;
  }
});

  const navigate = useNavigate();

// STEP 1: /auth/login never returns a token — it just generates and
  // saves a fresh OTP for this login attempt.
  const requestLoginOtp = useCallback(async (email) => {
    const { data } = await api.post(ENDPOINTS.login, { email });
    if (!data?.success) {
      throw new Error(data?.message || "Couldn't send login OTP.");
    }
    return data; // { success, message, otp } — otp only present while backend logs it for dev
  }, []);

  // STEP 2: verifying that OTP is what actually returns token + user.
  const verifyLoginOtp = useCallback(async (email, otp) => {
    const { data } = await api.post(ENDPOINTS.verifyOtp, { email, otp });
    const token = data?.token;
    const user = data?.user;

    if (!token || !user) {``
      const missing = [!token && "token", !user && "user"].filter(Boolean).join(" and ");
      throw new Error(
        `Verify-OTP response is missing "${missing}". Raw response keys: [${Object.keys(data || {}).join(", ")}]`
      );
    }

    localStorage.setItem("mfc_token", token);
    localStorage.setItem("mfc_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mfc_token");
    localStorage.removeItem("mfc_user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, requestLoginOtp, verifyLoginOtp, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
