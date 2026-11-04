import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Cpu, Globe2, HeartPulse, Rocket } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Job } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { StarMark } from "@/components/StarMark";

const PERKS = [
  { icon: Rocket, title: "Real ownership", desc: "Small senior teams, no ticket factories. You ship to production in week one." },
  { icon: Cpu, title: "Modern stack", desc: "React, FastAPI, Kubernetes, LLM tooling — we pay down tech debt, not accrue it." },
  { icon: Globe2, title: "Hybrid & flexible", desc: "Bengaluru and Hyderabad studios, async-first culture, flexible hours." },
  { icon: HeartPulse, title: "Full benefits", desc: "Health cover for family, learning budget, and annual offsite." },
];

export default function Careers() {
  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiGet<Job[]>("/jobs"),
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />

      <header className="border-b border-line/70 bg-white/85 backdrop-blur-xl dark:bg-[#070B12]/85">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-6 lg:px-10">
          <Link to="/" data-testid="careers-logo" className="flex items-center gap-3">
            <StarMark className="h-6 w-6 text-teal" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-lg tracking-[0.08em]">KALYANI</span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
            </span>
          </Link>
          <Link to="/" data-testid="careers-back-link" className="ml-auto inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-teal-bright">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="pt-20 lg:pt-28">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
            <StarMark className="h-3.5 w-3.5" /> Careers
          </p>
          <h1 data-testid="careers-title" className="max-w-3xl font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Build software that outshines the ordinary — <em className="not-italic text-teal-bright">with us</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
            We're a senior-led studio working on fintech rails, AI engines, and cloud platforms used by
            thousands every day. If you want craft, ownership, and honest engineering — join us.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div data-testid={`careers-perk-${i}`} className="card-lift h-full rounded-2xl border border-line bg-panel p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 text-teal-bright dark:bg-[#0D2B2C]/60">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 pb-24">
          <Reveal>
            <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl">Open positions</h2>
          </Reveal>

          {isLoading && <p className="mt-10 text-mist" data-testid="careers-loading">Loading open positions…</p>}
          {isError && (
            <p className="mt-10 text-mist" data-testid="careers-error">
              Open positions can't be loaded right now — please check back soon.
            </p>
          )}
          {jobs && jobs.length === 0 && (
            <div className="mt-10 rounded-2xl border border-line bg-panel p-10 text-center" data-testid="careers-empty">
              <p className="font-heading text-xl text-foreground">No open positions right now</p>
              <p className="mt-2 text-sm text-mist">
                We're always happy to meet great engineers — write to{" "}
                <a href="mailto:hello@kalyanitechnologies.com" className="text-teal-bright">hello@kalyanitechnologies.com</a>
              </p>
            </div>
          )}

          <div className="mt-10 space-y-6">
            {jobs?.map((job, i) => (
              <Reveal key={job.id} delay={i * 0.05}>
                <article data-testid={`careers-job-${job.id}`} className="card-lift rounded-2xl border border-line bg-panel p-8 lg:p-10">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-2xl text-foreground">{job.title}</h3>
                        <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-teal-bright dark:bg-[#0D2B2C]/60">
                          {job.technology}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mist">
                        {job.location} · {job.job_type}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">{job.description}</p>
                    </div>
                    <a
                      data-testid={`careers-apply-${job.id}`}
                      href={`mailto:hello@kalyanitechnologies.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright"
                    >
                      Apply Now
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-mist">
            Don't see your role? Surprise us —{" "}
            <a data-testid="careers-open-application" href="mailto:hello@kalyanitechnologies.com?subject=Open%20Application" className="text-teal-bright transition-colors hover:text-foreground">
              send an open application
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
