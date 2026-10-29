import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import AuthShell from "./AuthShell.jsx";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const testOtp = location.state?.otp;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post(ENDPOINTS.verifyOtp, { email, otp });
      setDone(true);
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell eyebrow="auth/verify-otp" title="You're verified 🎉" subtitle="Taking you to the login page...">
        <div className="flex items-center gap-3 rounded-xl bg-mint-light px-4 py-4 text-mint-dark">
          <ShieldCheck size={22} />
          <p className="text-sm font-semibold">Email verified successfully.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="auth/verify-otp" title="Check your email" subtitle="We sent a 6-digit code to your inbox.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">OTP code</label>
          <input
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="input text-center font-mono text-lg tracking-[0.5em]"
          />
        </div>

        {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        Back to{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          log in
        </Link>
      </p>
    </AuthShell>
  );
}
