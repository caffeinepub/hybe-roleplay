import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface ElementsPanelProps {
  onBack: () => void;
}

const ELEMENTS = [
  {
    id: "fire",
    name: "Fire",
    subtitle: "[ Ashfall Kindle ]",
    tagline: "fire, restrained",
    description:
      "It does not rage. It smolders beneath the surface — a controlled burn that shapes everything it touches, never consuming what it loves, only refining it. Ashfall Kindle is fire that chose patience.",
    symbol: "🜂",
    accentHue: "30",
  },
  {
    id: "water",
    name: "Water",
    subtitle: "[ Undertow Tidefall ]",
    tagline: "emotions, in motion",
    description:
      "Deeper than the surface, wider than the shore. Undertow Tidefall moves without asking permission — it pulls, it cradles, it carries. Feeling everything and still choosing to flow.",
    symbol: "🜄",
    accentHue: "220",
  },
  {
    id: "air",
    name: "Air",
    subtitle: "[ Skylow Veil ]",
    tagline: "light you cannot hold",
    description:
      "It is everywhere and nowhere at once. Skylow Veil passes through walls and fills the spaces between words. You can feel it — on your skin, in your lungs — but the moment you reach for it, it is already gone.",
    symbol: "🜁",
    accentHue: "190",
  },
  {
    id: "earth",
    name: "Earth",
    subtitle: "[ Softland Hearth ]",
    tagline: "softness, that stays",
    description:
      "It does not rush to prove itself. Softland Hearth is the ground beneath every fall, the root beneath every storm. Steady, warm, and always there — strength disguised as gentleness.",
    symbol: "🜃",
    accentHue: "120",
  },
];

const SLIDE_OCIDS = [
  "elements.slide.1",
  "elements.slide.2",
  "elements.slide.3",
  "elements.slide.4",
];
const DOT_OCIDS = [
  "elements.dot.1",
  "elements.dot.2",
  "elements.dot.3",
  "elements.dot.4",
];

export function ElementsPanel({ onBack }: ElementsPanelProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const prev = () => {
    if (current > 0) goTo(current - 1, -1);
  };

  const next = () => {
    if (current < ELEMENTS.length - 1) goTo(current + 1, 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const el = ELEMENTS[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#000000" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, oklch(15 0.06 ${el.accentHue} / 0.35) 0%, transparent 70%)`,
            transition: "background 0.8s ease",
          }}
        />
      </div>

      {/* Back button */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <button
          type="button"
          data-ocid="elements.back_button"
          onClick={onBack}
          className="font-cinzel text-sm tracking-[0.3em] uppercase cursor-pointer focus:outline-none focus-visible:ring-1"
          style={{
            color: "oklch(75 0.18 50)",
            border: "1px solid oklch(75 0.18 50 / 0.4)",
            padding: "6px 16px",
            background: "transparent",
          }}
        >
          ← Back
        </button>
        <span
          className="font-cinzel text-xs tracking-[0.4em] uppercase opacity-50"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          The Elements Era
        </span>
      </div>

      {/* Slide area */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
        {/* Left arrow */}
        <button
          type="button"
          data-ocid="elements.prev_button"
          onClick={prev}
          disabled={current === 0}
          className="absolute left-4 z-20 font-cinzel text-2xl cursor-pointer focus:outline-none transition-opacity duration-200"
          style={{
            color: "oklch(75 0.18 50)",
            opacity: current === 0 ? 0.15 : 0.6,
            background: "transparent",
            border: "none",
            padding: "12px",
          }}
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          type="button"
          data-ocid="elements.next_button"
          onClick={next}
          disabled={current === ELEMENTS.length - 1}
          className="absolute right-4 z-20 font-cinzel text-2xl cursor-pointer focus:outline-none transition-opacity duration-200"
          style={{
            color: "oklch(75 0.18 50)",
            opacity: current === ELEMENTS.length - 1 ? 0.15 : 0.6,
            background: "transparent",
            border: "none",
            padding: "12px",
          }}
        >
          ›
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={el.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            data-ocid={SLIDE_OCIDS[current]}
            className="flex flex-col items-center text-center px-10 max-w-2xl mx-auto"
          >
            {/* Decorative top line */}
            <div className="h-px w-24 gold-shimmer mb-8" />

            {/* Symbol */}
            <span
              className="text-5xl mb-4 select-none"
              style={{
                filter: "drop-shadow(0 0 18px oklch(75 0.18 50 / 0.5))",
                fontSize: "3rem",
              }}
            >
              {el.symbol}
            </span>

            {/* Element name */}
            <h1
              className="font-cinzel font-bold uppercase tracking-[0.2em] mb-3"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                color: "#ffffff",
                textShadow: "0 0 40px oklch(75 0.18 50 / 0.3)",
              }}
            >
              {el.name}
            </h1>

            {/* Subtitle */}
            <p
              className="font-cinzel tracking-[0.15em] mb-4"
              style={{
                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                color: "oklch(75 0.18 50)",
              }}
            >
              {el.subtitle}
            </p>

            {/* Tagline */}
            <p
              className="font-raleway italic tracking-widest mb-6"
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                color: "oklch(75 0.18 50)",
                opacity: 0.85,
              }}
            >
              {el.tagline}
            </p>

            {/* Decorative line */}
            <div className="h-px w-16 gold-shimmer mb-6" />

            {/* Description */}
            <p
              className="font-raleway leading-relaxed"
              style={{
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                color: "rgba(255,255,255,0.7)",
                maxWidth: "500px",
              }}
            >
              {el.description}
            </p>

            {/* Decorative bottom line */}
            <div className="h-px w-24 gold-shimmer mt-8" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="relative z-10 flex justify-center gap-3 pb-8 pt-4">
        {ELEMENTS.map((elem, idx) => (
          <button
            type="button"
            key={elem.id}
            data-ocid={DOT_OCIDS[idx]}
            onClick={() => goTo(idx, idx > current ? 1 : -1)}
            className="cursor-pointer focus:outline-none transition-all duration-300"
            style={{
              width: idx === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background:
                idx === current
                  ? "oklch(75 0.18 50)"
                  : "oklch(75 0.18 50 / 0.3)",
              border: "none",
              padding: 0,
            }}
            aria-label={`Go to ${elem.name}`}
          />
        ))}
      </div>
    </div>
  );
}
