import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { StarMark } from "./StarMark";

const TESTIMONIALS = [
  {
    id: "ananya",
    quote: "Kalyani rebuilt our payment core without a single minute of downtime. They think like owners, not vendors — every sprint ended with something we could actually use.",
    name: "Ananya Rao",
    role: "CTO, VaultPay",
  },
  {
    id: "marcus",
    quote: "The rare team that pairs genuine design taste with serious distributed-systems depth. Our deploy cadence went from monthly to daily within one quarter.",
    name: "Marcus Feld",
    role: "VP Engineering, Helios",
  },
  {
    id: "priya",
    quote: "They told us what not to build — and were right. That honesty saved us six months and a seven-figure mistake. We haven't worked with anyone else since.",
    name: "Priya Nair",
    role: "Founder, Sentinel AI",
  },
];

export const Testimonials = () => (
  <section id="testimonials" data-testid="testimonials-section" className="scroll-mt-24 py-24 lg:py-36">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
            <StarMark className="h-3.5 w-3.5" /> Client Voices
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by teams who ship.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.08}>
            <figure
              data-testid={`testimonial-card-${t.id}`}
              className="card-lift flex h-full flex-col rounded-2xl border border-line bg-panel p-8"
            >
              <Quote className="h-6 w-6 text-coral" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90 md:text-base">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-line pt-5">
                <p className="font-heading text-lg text-foreground">{t.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-teal-bright">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
