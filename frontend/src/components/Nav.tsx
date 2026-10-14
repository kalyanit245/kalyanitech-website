import { useEffect, useState } from "react";
import { StarMark } from "./StarMark";
import { scrollToId } from "./Reveal";

const LINKS = [
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact", id: "contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      data-testid="site-nav"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line/70 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          data-testid="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
          aria-label="Kalyani Technologies home"
        >
          <StarMark className="h-7 w-7 text-teal drop-shadow-[0_0_14px_rgba(20,184,166,0.55)]" />
          <span className="flex flex-col items-start leading-none">
            <span className="font-heading text-xl tracking-[0.08em] text-foreground">KALYANI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-coral">
              Technologies
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="text-sm text-mist transition-colors duration-200 hover:text-teal-bright"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="nav-cta"
            onClick={() => go("contact")}
            className="hidden rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-[#042F2E] transition-colors duration-200 hover:bg-teal-bright sm:block"
          >
            Start a Project
          </button>
          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`h-px w-5 bg-foreground transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-foreground transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/60 bg-white/95 px-6 py-6 backdrop-blur-xl lg:hidden" data-testid="nav-mobile-menu">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-mobile-link-${l.id}`}
                onClick={() => go(l.id)}
                className="text-left text-lg text-foreground/90"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="nav-mobile-cta"
              onClick={() => go("contact")}
              className="mt-2 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-[#042F2E]"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
