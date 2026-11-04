import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { StarMark } from "@/components/StarMark";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiPost("/auth/forgot-password", { email });
    } catch {
      // The endpoint never reveals account existence; show the same confirmation either way.
    } finally {
      setSent(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <Link to="/" data-testid="forgot-logo" className="mb-10 flex items-center justify-center gap-3">
          <StarMark className="h-8 w-8 text-teal drop-shadow-[0_0_16px_rgba(20,184,166,0.5)]" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-2xl tracking-[0.08em]">KALYANI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-panel p-8 lg:p-10">
          {sent ? (
            <div className="text-center" data-testid="forgot-success">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-teal-bright">
                <MailCheck className="h-6 w-6" />
              </span>
              <h1 className="font-heading text-2xl tracking-tight">Check your inbox</h1>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                If an admin account exists for <span className="text-foreground">{email}</span>, a password
                reset link is on its way. It expires in 1 hour.
              </p>
            </div>
          ) : (
            <form data-testid="forgot-form" onSubmit={onSubmit}>
              <h1 className="font-heading text-2xl tracking-tight">Forgot your password?</h1>
              <p className="mt-2 text-sm text-mist">
                Enter your admin email and we'll send you a reset link.
              </p>
              <div className="mt-8">
                <label htmlFor="forgot-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Email</label>
                <Input
                  id="forgot-email"
                  data-testid="forgot-form-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kalyanitechnologies.com"
                  className="h-12 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60"
                />
              </div>
              <button
                data-testid="forgot-form-submit"
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-full bg-teal px-8 py-3.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link to="/login" data-testid="forgot-back-link" className="text-sm text-mist transition-colors hover:text-teal-bright">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
