import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ArrowRight, Clock3 } from "lucide-react";
import api from "../../api/axios.js";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";
import { useReferralAuth } from "../../context/ReferralAuthContext.jsx";

const EMPTY_REGISTER = {
  instituteName: "", contactPerson: "", mobile: "", email: "", password: "", confirmPassword: "",
  address: "", city: "", state: "", pincode: "", gstNumber: "", panNumber: "", website: "",
};

function Shell({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><Building2 size={18} /></div>
          <span className="font-display text-lg font-bold text-ink">myFirstCode<span className="text-mint">_</span> <span className="text-slate-muted">Referral Portal</span></span>
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ReferralLogin() {
  const { login } = useReferralAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setPending(false); setLoading(true);
    try {
      await login(email, password);
      navigate("/referral/dashboard");
    } catch (err) {
      if (err?.response?.status === 403) setPending(true);
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title="Referral Partner Login" subtitle="Institutes, coaching classes & consultants — refer students here.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && !pending && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
        {pending && (
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-light px-3.5 py-3 text-xs font-medium text-amber-dark">
            <Clock3 size={16} className="mt-0.5 shrink-0" />
            <span>Your account is pending admin approval. You'll be able to log in once approved.</span>
          </div>
        )}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Log in"} <ArrowRight size={16} /></button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-muted">
        New partner? <Link to="/referral/register" className="font-semibold text-brand hover:underline">Register here</Link>
      </p>
    </Shell>
  );
}

export function ReferralRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post(REFERRAL_ENDPOINTS.register, form);
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Shell title="Registration submitted 🎉" subtitle="Your account is pending admin approval.">
        <p className="text-sm text-ink/80">You'll be able to log in once an admin approves your account.</p>
        <button className="btn-primary mt-5 w-full" onClick={() => navigate("/referral/login")}>Go to login</button>
      </Shell>
    );
  }

  return (
    <Shell title="Referral Partner Registration" subtitle="Refer students and track their admission journey.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Institute / Class Name *</label><input required className="input" value={form.instituteName} onChange={update("instituteName")} /></div>
          <div><label className="label">Contact Person *</label><input required className="input" value={form.contactPerson} onChange={update("contactPerson")} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Mobile *</label><input required className="input" value={form.mobile} onChange={update("mobile")} /></div>
          <div><label className="label">Email *</label><input type="email" required className="input" value={form.email} onChange={update("email")} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Password *</label><input type="password" required className="input" value={form.password} onChange={update("password")} /></div>
          <div><label className="label">Confirm Password *</label><input type="password" required className="input" value={form.confirmPassword} onChange={update("confirmPassword")} /></div>
        </div>
        <div><label className="label">Address</label><input className="input" value={form.address} onChange={update("address")} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label">City</label><input className="input" value={form.city} onChange={update("city")} /></div>
          <div><label className="label">State</label><input className="input" value={form.state} onChange={update("state")} /></div>
          <div><label className="label">PIN Code</label><input className="input" value={form.pincode} onChange={update("pincode")} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="label">GST No. (optional)</label><input className="input" value={form.gstNumber} onChange={update("gstNumber")} /></div>
          <div><label className="label">PAN No. (optional)</label><input className="input" value={form.panNumber} onChange={update("panNumber")} /></div>
          <div><label className="label">Website (optional)</label><input className="input" value={form.website} onChange={update("website")} /></div>
        </div>
        {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Submitting..." : "Register"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-muted">
        Already registered? <Link to="/referral/login" className="font-semibold text-brand hover:underline">Log in</Link>
      </p>
    </Shell>
  );
}