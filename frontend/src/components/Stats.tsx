import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

const Counter = ({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
};

const STATS = [
  { value: 45, suffix: "+", label: "Enterprise Clients", decimals: 0 },
  { value: 120, suffix: "+", label: "Platforms Launched", decimals: 0 },
  { value: 99.9, suffix: "%", label: "Fleet Uptime", decimals: 1 },
  { value: 15, suffix: "ms", label: "Avg. API Latency", decimals: 0 },
];

export const Stats = () => (
  <section data-testid="stats-section" className="border-y border-line/60 bg-panel/30 py-16 lg:py-20">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-6 lg:grid-cols-4 lg:px-10">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          data-testid={`stat-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className={`border-t-2 pt-6 ${i % 2 === 0 ? "pr-6" : ""} lg:pr-0 ${
            i === 0 ? "border-teal" : i === STATS.length - 1 ? "border-coral" : "border-line"
          }`}
        >
          <p className="font-heading text-4xl tracking-tight text-foreground lg:text-5xl">
            <Counter to={s.value} suffix={s.suffix} decimals={s.decimals} />
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-mist">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);
