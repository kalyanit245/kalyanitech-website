import { StarMark } from "./StarMark";

const STACK = [
  "TypeScript", "React", "Python", "FastAPI", "Kubernetes", "AWS",
  "PostgreSQL", "TensorFlow", "Go", "GraphQL", "Docker", "Redis",
];

export const Marquee = () => (
  <div data-testid="tech-marquee" className="overflow-hidden border-y border-line/60 bg-panel/40 py-6" aria-label="Technologies we work with">
    <div className="marquee-track flex w-max items-center">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
          {STACK.map((item) => (
            <span key={`${copy}-${item}`} className="flex items-center">
              <span className="px-8 text-sm font-medium uppercase tracking-[0.28em] text-mist">
                {item}
              </span>
              <StarMark className="h-3 w-3 text-teal/50" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
