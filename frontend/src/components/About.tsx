import { Reveal } from "./Reveal";
import { StarMark } from "./StarMark";

const VALUES = [
  { title: "Senior-only delivery", desc: "The people who pitch your project are the people who build it." },
  { title: "Radical transparency", desc: "Weekly demos, open boards, and honest estimates — no theatre." },
  { title: "Built to hand over", desc: "Clean architecture, real docs, and your team fully enabled at exit." },
];

export const About = () => (
  <section id="about" data-testid="about-section" className="scroll-mt-24 border-y border-line/60 bg-panel/30 py-24 lg:py-36">
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12 lg:px-10">
      <Reveal className="lg:col-span-5">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-line">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwdGVhbSUyMHRlY2h8ZW58MHx8fHwxNzkxMTU3MzI4fDA&ixlib=rb-4.1.0&q=85"
              alt="Kalyani Technologies engineering team collaborating"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl border border-teal/30 bg-white/90 px-5 py-4 shadow-lg backdrop-blur lg:-right-8">
            <StarMark className="star-turn h-8 w-8 text-teal" />
            <div>
              <p className="font-heading text-lg text-foreground">Since 2016</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">Bengaluru · Hyderabad</p>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="lg:col-span-7 lg:pl-8">
        <Reveal>
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-teal-bright">
            <StarMark className="h-3.5 w-3.5" /> About Kalyani
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            A studio built by engineers who got tired of agencies.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
            We started Kalyani Technologies in 2016 with one conviction: great software comes from small,
            senior teams given real ownership. A decade later, that conviction has shipped 120+ platforms —
            from fintech rails moving crores daily to AI engines processing millions of events a second.
          </p>
        </Reveal>
        <div className="mt-12 space-y-0">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex gap-6 border-t border-line py-6" data-testid={`about-value-${i}`}>
                <span className="font-mono text-sm text-teal-bright">0{i + 1}</span>
                <div>
                  <h3 className="font-heading text-xl text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist md:text-base">{v.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
