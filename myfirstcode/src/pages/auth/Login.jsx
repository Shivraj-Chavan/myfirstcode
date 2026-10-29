import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock3 } from "lucide-react";
import AuthShell from "./AuthShell.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { requestLoginOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [testOtp, setTestOtp] = useState("");

  const parseError = (err) => {
    if (err?.response) return err.response.data?.message || "Something went wrong. Try again.";
    if (err?.request) return "Can't reach the server — check that the backend is running and VITE_API_URL matches its port.";
    return err.message || "Something went wrong. Try again.";
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setPending(false);
    setLoading(true);
    try {
      const response = await requestLoginOtp(email);

setTestOtp(response.otp); // Testing only
setStep("otp");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      if (err?.response?.status === 403) setPending(true);
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await verifyLoginOtp(email, otp);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthShell
      title={step === "email" ? "Welcome back" : "Enter the code"}
      subtitle={step === "email" ? "Log in to pick up right where you left off." : `We sent a login code to ${email}.`}
    >
      {step === "email" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@myfirstcode.com"
              className="input"
            />
          </div>

          {error && !pending && (
            <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>
          )}
          {pending && (
            <div className="flex items-start gap-2.5 rounded-lg bg-amber-light px-3.5 py-3 text-xs font-medium text-amber-dark">
              <Clock3 size={16} className="mt-0.5 shrink-0" />
              <span>Your teacher account is waiting on admin approval. You'll be able to log in as soon as it's approved.</span>
            </div>
          )}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending code..." : "Send login code"}
            <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="space-y-4">
          <div>
            <label className="label">Login code</label>
       {testOtp && (
      <span className="text-xs font-semibold text-blue-600">
        (Test OTP: {testOtp})
      </span>
    )}
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
            {loading ? "Verifying..." : "Verify & log in"}
            <ArrowRight size={16} />
          </button>
          <button type="button" onClick={() => setStep("email")} className="btn-ghost w-full">
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-muted">
        New here?{" "}
        <Link to="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}