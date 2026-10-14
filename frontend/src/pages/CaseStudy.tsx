import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { StarMark } from "@/components/StarMark";

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "challenge", label: "The Challenge" },
  { key: "solution", label: "Our Solution" },
] as const;

export default function CaseStudy() {
  const { slug } = useParams();
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return <Navigate to="/" replace />;
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />

      <header className="border-b border-line/70 bg-[#070B12]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-6 lg:px-10">
          <Link to="/" data-testid="case-study-logo" className="flex items-center gap-3">
            <StarMark className="h-6 w-6 text-teal" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-lg tracking-[0.08em]">KALYANI</span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
            </span>
          </Link>
          <Link to="/#work" data-testid="case-study-back-link" className="ml-auto inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-teal-bright">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="pt-20 lg:pt-28">
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-teal/30 bg-[#0D2B2C]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
              {project.category}
            </span>
            <span className="font-mono text-sm text-mist">{project.year}</span>
          </div>
          <h1 data-testid="case-study-title" className="mt-8 max-w-4xl font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">{project.tagline}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4" data-testid="case-study-meta">
            {[
              { k: "Client", v: project.client },
              { k: "Sector", v: project.category },
              { k: "Year", v: project.year },
              { k: "Engagement", v: "Design + Build + Scale" },
            ].map((m) => (
              <div key={m.k} className="bg-panel px-6 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{m.k}</p>
                <p className="mt-1.5 text-sm font-medium text-foreground">{m.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-line">
            <img
              src={project.image}
              alt={`${project.name} case study`}
              className="aspect-[21/9] w-full object-cover"
              data-testid="case-study-hero-image"
            />
          </div>
        </Reveal>

        <div className="mt-20 space-y-0">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-6 border-t border-line py-12 lg:grid-cols-12" data-testid={`case-study-section-${s.key}`}>
                <div className="lg:col-span-4">
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-teal-bright">
                    <StarMark className="h-3 w-3" /> {s.label}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-foreground/85 md:text-lg lg:col-span-8">
                  {project[s.key]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="rounded-2xl border border-line bg-panel p-8 lg:p-10" data-testid="case-study-stack">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-mist">Technology Stack</p>
            <div className="flex flex-wrap gap-2.5">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full border border-line bg-panel-alt px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-teal-bright">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3" data-testid="case-study-results">
            {project.results.map((r) => (
              <div key={r.label} className="rounded-2xl border border-line bg-panel p-8">
                <p className="font-heading text-4xl tracking-tight text-teal-bright">{r.value}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-mist">{r.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="my-20">
          <Link
            to={`/work/${next.slug}`}
            data-testid="case-study-next-link"
            className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-panel p-8 transition-colors duration-200 hover:border-teal/50 lg:p-10"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">Next Project</p>
              <p className="mt-3 font-heading text-3xl tracking-tight text-foreground transition-colors group-hover:text-teal-bright lg:text-4xl">
                {next.name}
              </p>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line text-mist transition-colors duration-200 group-hover:border-teal group-hover:bg-teal group-hover:text-[#042F2E]">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </Reveal>
      </main>
    </div>
  );
}
