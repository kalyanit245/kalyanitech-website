import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import type { Inquiry } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "./Reveal";
import { StarMark } from "./StarMark";

const SERVICES = ["Custom Software", "AI / ML Engineering", "Cloud & DevOps", "Web & Mobile Apps", "UI/UX Engineering", "IT Consulting"];
const BUDGETS = ["< ₹10 L", "₹10–25 L", "₹25–50 L", "₹50 L+", "Not sure yet"];

const inputCls =
  "h-12 rounded-xl border-line bg-panel-alt/60 px-4 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60";

const selectCls =
  "h-12 w-full appearance-none rounded-xl border border-line bg-panel-alt/60 px-4 text-sm text-foreground outline-none transition-colors focus:border-teal/60";

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", budget: "", message: "" });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await apiPost<Inquiry>("/inquiries", {
        name: form.name,
        email: form.email,
        company: form.company || null,
        service: form.service,
        budget: form.budget || null,
        message: form.message,
      });
      toast.success("Enquiry received — our team will respond within 24 hours.");
      setForm({ name: "", email: "", company: "", service: "", budget: "", message: "" });
    } catch {
      toast.error("Could not send your enquiry. Please check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="scroll-mt-24 border-t border-line/60 bg-panel/30 py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:px-10">
        <Reveal className="lg:col-span-5">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
            <StarMark className="h-3.5 w-3.5" /> Start a Project
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tell us what you're building.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg">
            Share a few lines about your product, timeline, and goals. A senior engineer — not a sales rep —
            replies within one business day.
          </p>

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 text-teal-bright">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">Email</p>
                <a data-testid="contact-email-link" href="mailto:hello@kalyanitechnologies.com" className="text-foreground transition-colors hover:text-teal-bright">
                  hello@kalyanitechnologies.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 text-teal-bright">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">Studios</p>
                <p className="text-foreground">Bengaluru · Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-coral/30 bg-coral/10 text-coral-soft">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">Response SLA</p>
                <p className="text-foreground">Under 24 hours, guaranteed</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            data-testid="contact-form"
            onSubmit={onSubmit}
            className="rounded-2xl border border-line bg-panel p-8 lg:p-10"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Name *</label>
                <Input id="cf-name" data-testid="contact-form-name-input" required minLength={2} value={form.name} onChange={set("name")} placeholder="Asha Verma" className={inputCls} />
              </div>
              <div>
                <label htmlFor="cf-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Work Email *</label>
                <Input id="cf-email" data-testid="contact-form-email-input" required type="email" value={form.email} onChange={set("email")} placeholder="asha@company.com" className={inputCls} />
              </div>
              <div>
                <label htmlFor="cf-company" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Company</label>
                <Input id="cf-company" data-testid="contact-form-company-input" value={form.company} onChange={set("company")} placeholder="Company Pvt Ltd" className={inputCls} />
              </div>
              <div>
                <label htmlFor="cf-service" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Service Needed *</label>
                <select id="cf-service" data-testid="contact-form-service-select" required value={form.service} onChange={set("service")} className={selectCls}>
                  <option value="" disabled>Select a service</option>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="cf-budget" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Budget Range</label>
                <select id="cf-budget" data-testid="contact-form-budget-select" value={form.budget} onChange={set("budget")} className={selectCls}>
                  <option value="">Prefer not to say</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="cf-message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-mist">Project Details *</label>
                <Textarea id="cf-message" data-testid="contact-form-message-input" required minLength={10} rows={5} value={form.message} onChange={set("message")} placeholder="What are you building, what does success look like, and when do you need it?" className="rounded-xl border-line bg-panel-alt/60 px-4 py-3 text-foreground placeholder:text-mist/60 focus-visible:border-teal/60" />
              </div>
            </div>
            <button
              data-testid="contact-form-submit"
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
