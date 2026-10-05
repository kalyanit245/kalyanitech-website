import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Cloud, Code2, Compass, PenTool, Smartphone } from "lucide-react";
import { Reveal } from "./Reveal";
import { StarMark } from "./StarMark";

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
  span: string;
  code?: boolean;
  banner?: boolean;
}

const SERVICES: Service[] = [
  {
    id: "custom-software",
    icon: Code2,
    title: "Custom Software Architecture",
    desc: "Distributed systems, event-driven backends, and platforms engineered for a decade of growth — not just the next release.",
    tags: ["Microservices", "Event-Driven", "DDD"],
    span: "md:col-span-8 md:row-span-2",
    code: true,
  },
  {
    id: "ai-ml",
    icon: BrainCircuit,
    title: "AI / ML Engineering",
    desc: "LLM-powered products, retrieval pipelines, and ML ops that survive production traffic.",
    tags: ["LLMs", "RAG", "MLOps"],
    span: "md:col-span-4",
  },
  {
    id: "cloud-devops",
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Kubernetes-native infrastructure, GitOps pipelines, and 99.99% uptime as a baseline.",
    tags: ["Kubernetes", "AWS", "GitOps"],
    span: "md:col-span-4",
  },
  {
    id: "web-mobile",
    icon: Smartphone,
    title: "Web & Mobile Apps",
    desc: "React, React Native, and Flutter products with obsessive attention to frame budgets and perceived speed.",
    tags: ["React", "Flutter", "PWA"],
    span: "md:col-span-6",
  },
  {
    id: "ui-ux",
    icon: PenTool,
    title: "UI/UX Engineering",
    desc: "Design systems and interfaces where motion, hierarchy, and craft are engineered — not decorated.",
    tags: ["Design Systems", "Motion", "Prototyping"],
    span: "md:col-span-6",
  },
  {
    id: "consulting",
    icon: Compass,
    title: "IT Consulting & Strategy",
    desc: "Fractional CTO guidance, architecture audits, and delivery rescue for teams that need senior firepower — from roadmap to release.",
    tags: ["Architecture Audit", "Fractional CTO", "Delivery Rescue"],
    span: "md:col-span-12",
    banner: true,
  },
];

const CODE_SNIPPET = [
  { text: "@kernel.module('payments')", cls: "text-teal-bright" },
  { text: "export class LedgerService {", cls: "text-foreground" },
  { text: "  @Transactional({ isolation: 'SERIALIZABLE' })", cls: "text-mist" },
  { text: "  async settle(batch: SettlementBatch) {", cls: "text-foreground" },
  { text: "    return this.ledger.commit(batch, { idempotent: true });", cls: "text-coral-soft" },
  { text: "  }", cls: "text-foreground" },
  { text: "}", cls: "text-foreground" },
];

export const Services = () => (
  <section id="services" data-testid="services-section" className="scroll-mt-24 py-24 lg:py-36">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
            <StarMark className="h-3.5 w-3.5" /> Capabilities
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Six disciplines. One obsessed team.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">
            Every engagement is senior-led. No hand-offs to juniors, no black boxes — just engineers who
            have shipped at scale and designers who sweat the details.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06} className={s.span}>
            <article
              data-testid={`service-card-${s.id}`}
              className={`card-lift group flex h-full flex-col rounded-2xl border border-line bg-panel p-8 ${
                s.banner ? "md:flex-row md:items-center md:justify-between md:gap-10" : ""
              }`}
            >
              <div className={s.banner ? "md:max-w-2xl" : ""}>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-teal/25 bg-[#0D2B2C]/60 text-teal-bright transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl text-foreground md:text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-panel-alt px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-mist">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {s.code && (
                <div className="mt-8 overflow-hidden rounded-xl border border-line bg-[#070B12] md:flex-1">
                  <div className="border-b border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                    ledger.service.ts
                  </div>
                  <pre className="space-y-1 px-5 py-4 font-mono text-[12.5px] leading-relaxed">
                    {CODE_SNIPPET.map((l, i) => (
                      <div key={i} className={l.cls}>{l.text}</div>
                    ))}
                  </pre>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
