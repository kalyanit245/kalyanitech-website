import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { ApiError, apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { StarMark } from "@/components/StarMark";

const formatDetail = (body: unknown): string => {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const msgs = detail.map((e) => (e && typeof e.msg === "string" ? e.msg : "")).filter(Boolean);
    if (msgs.length) return msgs.join(" ");
  }
  return "Could not reset the password. Please try again.";
};

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiPost("/auth/reset-password", { token, new_password: password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? formatDetail(err.body) : "Could not reset the password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "h-12 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <Link to="/" data-testid="reset-logo" className="mb-10 flex items-center justify-center gap-3">
          <StarMark className="h-8 w-8 text-teal drop-shadow-[0_0_16px_rgba(20,184,166,0.5)]" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-2xl tracking-[0.08em]">KALYANI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-panel p-8 lg:p-10">
          {done ? (
            <div className="text-center" data-testid="reset-success">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-teal-bright">
                <CircleCheck className="h-6 w-6" />
              </span>
              <h1 className="font-heading text-2xl tracking-tight">Password updated</h1>
              <p className="mt-3 text-sm text-mist">You can now sign in with your new password.</p>
              <Link
                to="/login"
                data-testid="reset-goto-login"
                className="mt-8 inline-block rounded-full bg-teal px-8 py-3.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright"
              >
                Go to Sign In
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center" data-testid="reset-invalid">
              <h1 className="font-heading text-2xl tracking-tight">Invalid reset link</h1>
              <p className="mt-3 text-sm text-mist">
                This link is missing its token. Request a fresh one from the sign-in page.
              </p>
            </div>
          ) : (
            <form data-testid="reset-form" onSubmit={onSubmit}>
              <h1 className="font-heading text-2xl tracking-tight">Choose a new password</h1>
              <p className="mt-2 text-sm text-mist">Minimum 8 characters.</p>

              {error && (
                <div data-testid="reset-error" role="alert" className="mt-6 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral-soft dark:bg-[#2C1210]/60">
                  {error}
                </div>
              )}

              <div className="mt-8 space-y-5">
                <div>
                  <label htmlFor="reset-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">New Password</label>
                  <Input id="reset-password" data-testid="reset-form-password-input" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="reset-confirm" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Confirm Password</label>
                  <Input id="reset-confirm" data-testid="reset-form-confirm-input" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••••••" className={inputCls} />
                </div>
              </div>

              <button
                data-testid="reset-form-submit"
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-full bg-teal px-8 py-3.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link to="/login" data-testid="reset-back-link" className="text-sm text-mist transition-colors hover:text-teal-bright">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
