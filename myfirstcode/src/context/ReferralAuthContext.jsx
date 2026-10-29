import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { REFERRAL_ENDPOINTS } from "../api/referralEndpoints.js";

const ReferralAuthContext = createContext(null);

export function ReferralAuthProvider({ children }) {
  const [partner, setPartner] = useState(() => {
    const raw = localStorage.getItem("refp_partner");
    if (!raw || raw === "undefined") return null;
    try { return JSON.parse(raw); } catch { return null; }
  });
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    const { data } = await api.post(REFERRAL_ENDPOINTS.login, { email, password });
    localStorage.setItem("refp_token", data.token);
    localStorage.setItem("refp_partner", JSON.stringify(data.partner));
    setPartner(data.partner);
    return data.partner;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("refp_token");
    localStorage.removeItem("refp_partner");
    setPartner(null);
    navigate("/referral/login");
  }, [navigate]);

  return (
    <ReferralAuthContext.Provider value={{ partner, login, logout }}>
      {children}
    </ReferralAuthContext.Provider>
  );
}

export const useReferralAuth = () => useContext(ReferralAuthContext);