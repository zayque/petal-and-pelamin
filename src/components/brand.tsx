import Link from "next/link";

export function PetalMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g transform="translate(32 33)">
        {[0, 72, 144, 216, 288].map((r, i) => (
          <ellipse
            key={r}
            rx="7"
            ry="13"
            transform={`rotate(${r}) translate(0 -9)`}
            className={i % 2 ? "fill-blush-300" : "fill-blush-400"}
          />
        ))}
        <circle r="5" className="fill-blush-50" />
      </g>
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2.5" aria-label="Petal & Pelamin home">
      <PetalMark className="size-9 transition-transform duration-500 group-hover:rotate-[72deg]" />
      <span className="font-display text-2xl leading-none font-semibold text-blush-900">
        Petal <span className="font-script text-blush-500 text-[1.6rem] font-normal">&amp;</span> Pelamin
      </span>
    </Link>
  );
}

/** Soft floating petals used as decoration behind hero sections. */
export function FloatingPetals() {
  const petals = [
    { l: "6%", t: "18%", s: 18, d: "0s" },
    { l: "88%", t: "12%", s: 26, d: "1.2s" },
    { l: "74%", t: "68%", s: 16, d: "2.4s" },
    { l: "14%", t: "78%", s: 22, d: "3.1s" },
    { l: "48%", t: "6%", s: 12, d: "1.8s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 20 30"
          className="absolute animate-float fill-blush-200/80"
          style={{ left: p.l, top: p.t, width: p.s, animationDelay: p.d }}
        >
          <path d="M10 0C16 8 20 16 10 30 0 16 4 8 10 0Z" />
        </svg>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
