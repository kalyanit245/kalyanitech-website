import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { StarMark } from "./StarMark";

const CATEGORIES = ["All", "Enterprise SaaS", "FinTech", "AI Engines", "Cloud Native"] as const;

interface Project {
  id: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  desc: string;
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: "nexus-erp",
    name: "Nexus ERP",
    category: "Enterprise SaaS",
    desc: "Multi-tenant operations suite serving 40k daily users across 3 continents.",
    year: "2025",
    image: "https://images.unsplash.com/photo-1536148935331-408321065b18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwdGVhbSUyMHRlY2h8ZW58MHx8fHwxNzkxMTU3MzI4fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "vaultpay",
    name: "VaultPay",
    category: "FinTech",
    desc: "PCI-DSS compliant payment rails settling ₹200Cr+ monthly with zero downtime.",
    year: "2025",
    image: "https://images.unsplash.com/photo-1709377195538-5522ed0f9e10?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHw0fHxmaW50ZWNoJTIwcGF5bWVudCUyMGRhcmslMjBhYnN0cmFjdHxlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "sentinel-ai",
    name: "Sentinel AI",
    category: "AI Engines",
    desc: "Realtime anomaly-detection engine flagging fraud across 2M events per second.",
    year: "2026",
    image: "https://images.unsplash.com/photo-1637946175559-22c4fe13fc54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHxmaW50ZWNoJTIwcGF5bWVudCUyMGRhcmslMjBhYnN0cmFjdHxlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "helios-cloud",
    name: "Helios Cloud",
    category: "Cloud Native",
    desc: "Internal developer platform cutting deploy time from 45 minutes to 38 seconds.",
    year: "2026",
    image: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxjbG91ZCUyMGRhdGFjZW50ZXIlMjBzZXJ2ZXJzJTIwZGFya3xlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const Work = () => {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const visible = PROJECTS.filter((p) => active === "All" || p.category === active);

  return (
    <section id="work" data-testid="work-section" className="scroll-mt-24 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
                <StarMark className="h-3.5 w-3.5" /> Selected Work
              </p>
              <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Proof, not promises.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  data-testid={`work-filter-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  role="tab"
                  aria-selected={active === c}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    active === c
                      ? "border-teal bg-teal text-[#042F2E]"
                      : "border-line text-mist hover:border-teal/50 hover:text-teal-bright"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`work-card-${p.id}`}
              className={`group ${i % 2 === 1 ? "md:mt-16" : ""}`}
            >
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.category}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B12]/85 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full border border-line/70 bg-[#070B12]/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-teal-bright backdrop-blur">
                  {p.category}
                </span>
                <span className="absolute right-5 top-5 font-mono text-[11px] text-mist">{p.year}</span>
              </div>
              <div className="flex items-start justify-between gap-4 px-1 pt-5">
                <div>
                  <h3 className="font-heading text-2xl text-foreground">{p.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">{p.desc}</p>
                </div>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-mist transition-colors duration-200 group-hover:border-teal group-hover:bg-teal group-hover:text-[#042F2E]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
