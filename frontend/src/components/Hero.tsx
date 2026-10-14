import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { StarMark } from "./StarMark";
import { scrollToId } from "./Reveal";

const LOG_LINES = [
  "$ kalyani deploy --target production",
  "▸ provisioning cluster ......... ok",
  "▸ running 214 test suites ...... ok",
  "▸ zero-downtime rollout ........ ok",
  "▸ p95 latency 15ms ............ nominal",
  "▸ uptime 99.99% ............... nominal",
  "✓ release v4.2.0 live in 38s",
];

const MaskedLine = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const starY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const starRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const [logCount, setLogCount] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setLogCount((c) => (c >= LOG_LINES.length ? 1 : c + 1)), 1300);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={sectionRef} data-testid="hero-section" className="hero-scrim relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      <motion.div
        style={{ y: starY, rotate: starRotate }}
        className="pointer-events-none absolute -right-24 top-16 text-teal/10 lg:right-8"
        aria-hidden="true"
      >
        <StarMark className="h-[26rem] w-[26rem] lg:h-[34rem] lg:w-[34rem]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5"
            data-testid="hero-badge"
          >
            <StarMark className="h-3.5 w-3.5 text-teal-bright" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
              Next-Gen Software Engineering
            </span>
          </motion.div>

          <h1 className="font-heading text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl" data-testid="hero-headline">
            <MaskedLine delay={0.25}>We build software</MaskedLine>
            <MaskedLine delay={0.37}>
              that <em className="not-italic text-teal-bright">outshines</em>
            </MaskedLine>
            <MaskedLine delay={0.49}>
              the ordinary<span className="text-coral">.</span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-mist md:text-lg"
            data-testid="hero-subtext"
          >
            Kalyani Technologies is a full-cycle product engineering studio. We design, build, and scale
            enterprise platforms, AI systems, and cloud-native products for companies that refuse to ship average.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-cta-explore"
              onClick={() => scrollToId("services")}
              className="group inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright"
            >
              Explore Capabilities
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-cta-consult"
              onClick={() => scrollToId("contact")}
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-teal/60 hover:text-teal-bright"
            >
              <CalendarClock className="h-4 w-4" />
              Schedule Consultation
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="lg:col-span-5"
        >
          <div
            data-testid="hero-terminal"
            className="relative rounded-2xl border border-[#1E293B] bg-[#0B132B] shadow-[0_40px_120px_-40px_rgba(20,184,166,0.35)]"
          >
            <div className="flex items-center gap-2 border-b border-[#1E293B] px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#EAB308]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal/80" />
              <span className="ml-3 font-mono text-xs text-[#94A3B8]">kalyani · deploy console</span>
              <span className="pulse-dot ml-auto h-2 w-2 rounded-full bg-[#2DD4BF]" />
            </div>
            <div className="h-56 space-y-2.5 overflow-hidden px-5 py-4 font-mono text-[13px] leading-relaxed">
              {LOG_LINES.slice(0, logCount).map((line, i) => (
                <motion.p
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={line.startsWith("✓") ? "text-[#2DD4BF]" : line.startsWith("$") ? "text-[#F1F5F9]" : "text-[#94A3B8]"}
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#1E293B] border-t border-[#1E293B]">
              {[
                { k: "UPTIME", v: "99.99%" },
                { k: "P95 LATENCY", v: "15ms" },
                { k: "DEPLOYS / WK", v: "63" },
              ].map((m) => (
                <div key={m.k} className="px-4 py-4 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">{m.k}</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-[#2DD4BF]">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
