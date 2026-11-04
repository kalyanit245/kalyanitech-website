import { scrollToId } from "./Reveal";
import { StarMark } from "./StarMark";

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { label: "Services", id: "services" },
      { label: "Selected Work", id: "work" },
      { label: "About", id: "about" },
    ],
  },
  {
    title: "Engage",
    links: [
      { label: "Start a Project", id: "contact" },
      { label: "Testimonials", id: "testimonials" },
      { label: "Enquiries", id: "contact" },
    ],
  },
];

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-line bg-white dark:bg-[#05080D]">
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
      <div className="flex flex-col justify-between gap-12 lg:flex-row">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <StarMark className="h-8 w-8 text-teal drop-shadow-[0_0_16px_rgba(20,184,166,0.5)]" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-2xl tracking-[0.08em] text-foreground">KALYANI</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-coral">Technologies</span>
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-mist">
            Enterprise software, AI engineering, and product design from Bengaluru & Hyderabad.
            We build software that outshines the ordinary.
          </p>
          <a data-testid="footer-email-link" href="mailto:hello@kalyanitechnologies.com" className="mt-6 inline-block text-sm text-teal-bright transition-colors hover:text-foreground">
            hello@kalyanitechnologies.com
          </a>
        </div>

        <div className="flex gap-16 lg:gap-24">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      data-testid={`footer-link-${l.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => scrollToId(l.id)}
                      className="text-sm text-foreground/80 transition-colors hover:text-teal-bright"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 overflow-hidden" aria-hidden="true">
        <p className="select-none whitespace-nowrap font-heading text-[13vw] leading-none tracking-tight text-foreground/[0.045] lg:text-[10rem]">
          KALYANI ✦ TECHNOLOGIES
        </p>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line/60 pt-8 sm:flex-row sm:items-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
          © {new Date().getFullYear()} Kalyani Technologies Pvt Ltd
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
          Crafted in India · Shipped worldwide
        </p>
      </div>
    </div>
  </footer>
);
