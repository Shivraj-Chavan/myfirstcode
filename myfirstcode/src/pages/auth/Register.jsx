import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthShell from "./AuthShell.jsx";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";

const STANDARDS = ["6", "7", "8", "9", "10"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "student", standard: "6" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role !== "student") delete payload.standard;
      await api.post(ENDPOINTS.register, payload);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="auth/register" title="Create your account" subtitle="Students and teachers both start here.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input required value={form.name} onChange={update("name")} placeholder="Aditi Sharma" className="input" />
        </div>

        <div>
          <label className="label">Email address</label>
          <input type="email" required value={form.email} onChange={update("email")} placeholder="you@myfirstcode.com" className="input" />
        </div>

        <div>
          <label className="label">I am a...</label>
          <div className="grid grid-cols-2 gap-2">
            {["student", "teacher"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                  form.role === r ? "border-brand bg-brand-light text-brand" : "border-slate-faint/70 text-slate hover:border-brand/50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {form.role === "student" && (
          <div>
            <label className="label">Standard</label>
            <select value={form.standard} onChange={update("standard")} className="input">
              {STANDARDS.map((s) => (
                <option key={s} value={s}>
                  Std {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.role === "teacher" && (
          <p className="rounded-lg bg-amber-light px-3.5 py-2.5 text-xs font-medium text-amber-dark">
            Teacher accounts need admin approval after verification, before you can log in.
          </p>
        )}

        {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Continue"}
          <ArrowRight size={16} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
