import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { Input } from "@/components/ui/input";
import { StarMark } from "@/components/StarMark";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const formatDetail = (body: unknown): string => {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const msgs = detail.map((e) => (e && typeof e.msg === "string" ? e.msg : "")).filter(Boolean);
    if (msgs.length) return msgs.join(" ");
  }
  return "Login failed. Please try again.";
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await apiPost<AdminUser>("/auth/login", { email, password });
      beginSession();
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? formatDetail(err.body) : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-teal/10" aria-hidden="true">
        <StarMark className="h-72 w-72" />
      </div>

      <div className="relative w-full max-w-md">
        <Link to="/" data-testid="login-logo" className="mb-10 flex items-center justify-center gap-3">
          <StarMark className="h-8 w-8 text-teal drop-shadow-[0_0_16px_rgba(20,184,166,0.5)]" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-2xl tracking-[0.08em]">KALYANI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
          </span>
        </Link>

        <form
          data-testid="login-form"
          onSubmit={onSubmit}
          className="rounded-2xl border border-line bg-panel p-8 lg:p-10"
        >
          <h1 className="font-heading text-2xl tracking-tight">Admin Console</h1>
          <p className="mt-2 text-sm text-mist">Sign in to view project enquiries.</p>

          {error && (
            <div data-testid="login-error" role="alert" className="mt-6 rounded-xl border border-coral/40 bg-[#2C1210]/60 px-4 py-3 text-sm text-coral-soft">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Email</label>
              <Input
                id="login-email"
                data-testid="login-form-email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kalyanitechnologies.com"
                className="h-12 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Password</label>
              <Input
                id="login-password"
                data-testid="login-form-password-input"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-12 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60"
              />
            </div>
          </div>

          <button
            data-testid="login-form-submit-button"
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-full bg-teal px-8 py-3.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" data-testid="login-back-link" className="text-sm text-mist transition-colors hover:text-teal-bright">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
