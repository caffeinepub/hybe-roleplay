import { useEffect, useRef, useState } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"black" | "slam" | "settle" | "shine">(
    "black",
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const refs = timeoutsRef.current;
    const clearAll = () => {
      refs.forEach(clearTimeout);
      refs.length = 0;
    };

    // HM slams in
    const t1 = setTimeout(() => setPhase("slam"), 200);
    // Flash fades, logo settles with gold glow
    const t2 = setTimeout(() => setPhase("settle"), 800);
    // Shine sweep
    const t3 = setTimeout(() => setPhase("shine"), 1800);
    // Instant cut — no fade
    const t4 = setTimeout(() => onComplete(), 2800);

    refs.push(t1, t2, t3, t4);
    return clearAll;
  }, [onComplete]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Flash layer — fires on slam */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 35%, transparent 70%)",
          opacity: phase === "slam" ? 1 : 0,
          transition: phase === "slam" ? "none" : "opacity 0.5s ease-out",
          zIndex: 5,
        }}
      />

      {/* Secondary gold radiance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(210,170,80,0.35) 0%, transparent 65%)",
          opacity: phase === "settle" || phase === "shine" ? 1 : 0,
          transition: "opacity 0.6s ease-out",
          zIndex: 4,
        }}
      />

      {/* HM Logo */}
      <div className="relative select-none" style={{ zIndex: 10 }}>
        {/* Shine sweep overlay */}
        {(phase === "settle" || phase === "shine") && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 20 }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-120%",
                width: "60%",
                height: "100%",
                background:
                  "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
                animation:
                  phase === "shine"
                    ? "hmShine 0.7s ease-in-out forwards"
                    : "none",
              }}
            />
          </div>
        )}

        <h1
          style={{
            fontFamily: "'Stardos Stencil', cursive",
            fontWeight: 900,
            fontSize: "clamp(7rem, 28vw, 22rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: phase === "slam" ? "#ffffff" : "oklch(75 0.18 50)",
            textShadow:
              phase === "slam"
                ? "0 0 80px #fff, 0 0 160px rgba(255,255,255,0.8), 0 0 300px rgba(255,255,255,0.4)"
                : phase === "settle" || phase === "shine"
                  ? "0 0 30px oklch(75 0.18 50 / 0.9), 0 0 80px oklch(75 0.18 50 / 0.5), 0 0 160px oklch(75 0.18 50 / 0.25)"
                  : "none",
            transform:
              phase === "black"
                ? "scale(1.8)"
                : phase === "slam"
                  ? "scale(1.05)"
                  : "scale(1)",
            opacity: phase === "black" ? 0 : 1,
            transition:
              phase === "slam"
                ? "transform 0.08s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.05s ease-out, color 0s, text-shadow 0s"
                : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.6s ease-out, text-shadow 0.6s ease-out",
            position: "relative",
          }}
        >
          HM
        </h1>

        {/* Subtitle — fades in during settle */}
        <p
          style={{
            fontFamily: "'Tangerine', cursive",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
            textAlign: "center",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.08em",
            marginTop: "0.5rem",
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
            opacity: phase === "settle" || phase === "shine" ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.3s",
          }}
        >
          The elements era
        </p>
      </div>

      <button
        type="button"
        data-ocid="intro.skip_button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-xs tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: "'Raleway', sans-serif",
          zIndex: 20,
        }}
      >
        Skip ›
      </button>
    </div>
  );
}
