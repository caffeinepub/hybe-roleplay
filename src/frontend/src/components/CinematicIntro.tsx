import { useEffect, useRef, useState } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
}

const RAY_CONFIGS = [
  { key: "ray-0", i: 0 },
  { key: "ray-1", i: 1 },
  { key: "ray-2", i: 2 },
  { key: "ray-3", i: 3 },
  { key: "ray-4", i: 4 },
  { key: "ray-5", i: 5 },
];

interface ParticleData {
  id: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
  drift: string;
  size: string;
}

const PARTICLES: ParticleData[] = Array.from({ length: 40 }, (_, i) => ({
  id: `p${i}`,
  left: `${(i * 2.5) % 100}%`,
  top: `${60 + ((i * 0.75) % 30)}%`,
  delay: `${(i * 0.075) % 3}s`,
  duration: `${3 + ((i * 0.1) % 4)}s`,
  drift: `${((i % 10) - 5) * 16}px`,
  size: `${1 + (i % 3) * 0.5}px`,
}));

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"dark" | "fadein" | "hold" | "fadeout">(
    "dark",
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const refs = timeoutsRef.current;

    const clearAll = () => {
      refs.forEach(clearTimeout);
      refs.length = 0;
    };

    const t1 = setTimeout(() => setPhase("fadein"), 300);
    const t2 = setTimeout(() => setPhase("hold"), 1500);
    const t3 = setTimeout(() => setPhase("fadeout"), 2000);
    const t4 = setTimeout(() => onComplete(), 3000);

    refs.push(t1, t2, t3, t4);
    return clearAll;
  }, [onComplete]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    onComplete();
  };

  const titleClass =
    phase === "fadein" || phase === "hold"
      ? "hybe-title-fadein"
      : phase === "fadeout"
        ? "hybe-title-fadeout"
        : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        phase === "fadeout" ? "intro-container" : ""
      }`}
      style={{ background: "#000000" }}
    >
      {/* Projector flash — brief white/gold burst at fadein start */}
      {phase === "fadein" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "projectorFlash 0.5s ease-out forwards",
            zIndex: 20,
          }}
        />
      )}

      {/* Scan line sweeping top-to-bottom during fadein */}
      {phase === "fadein" && (
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: "1px",
            background: "oklch(75 0.18 50 / 0.45)",
            boxShadow:
              "0 0 8px oklch(75 0.18 50 / 0.6), 0 0 24px oklch(75 0.18 50 / 0.3)",
            animation: "scanLine 1.2s ease-in forwards",
            zIndex: 15,
            top: 0,
          }}
        />
      )}

      {/* Atmospheric rays */}
      {RAY_CONFIGS.map(({ key, i }) => (
        <div
          key={key}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse ${30 + i * 8}% ${60 + i * 5}% at ${30 + i * 8}% 50%, oklch(75 0.18 50 / 0.06) 0%, transparent 70%)`,
            animation: `rayPulse ${2 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gold opacity-0"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animation: `particleDrift ${p.duration} ${p.delay} ease-in-out infinite`,
              ["--drift" as string]: p.drift,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Title */}
      <div className="relative z-10 text-center select-none">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(75 0.18 50 / 0.12) 0%, transparent 70%)",
            filter: "blur(30px)",
            transform: "scale(2)",
          }}
        />

        <div className="relative">
          {phase !== "dark" && (
            <div className={`overflow-hidden mb-3 ${titleClass}`}>
              <div className="h-px w-32 mx-auto gold-shimmer mb-6" />
            </div>
          )}

          {/* Clip-path letter reveal wrapper */}
          <div
            className="overflow-hidden"
            style={{ display: phase !== "dark" ? "block" : "block" }}
          >
            <h1
              className={`tracking-[0.25em] text-gold font-bold ${
                phase !== "dark" ? "hybe-title-reveal" : "opacity-0"
              } ${phase === "fadeout" ? "hybe-title-fadeout" : ""}`}
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                lineHeight: 1.1,
                fontFamily: "Georgia, 'Times New Roman', serif",
                textShadow:
                  "-2px 0 oklch(65 0.25 20 / 0.3), 2px 0 oklch(65 0.18 250 / 0.3), 0 0 40px oklch(75 0.18 50 / 0.6), 0 0 80px oklch(75 0.18 50 / 0.3)",
              }}
            >
              HYBE MUSIC
            </h1>
          </div>

          {phase !== "dark" && (
            <div className={`overflow-hidden mt-6 ${titleClass}`}>
              <div className="h-px w-48 mx-auto gold-shimmer" />
              <p
                className="font-raleway text-xs tracking-[0.5em] uppercase mt-4 opacity-60"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                The elements era
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        data-ocid="intro.skip_button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-raleway text-xs tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        style={{ color: "oklch(75 0.18 50)" }}
      >
        Skip ›
      </button>
    </div>
  );
}
