import { useEffect, useRef, useState } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
}

const RAY_CONFIGS = [
  { key: "ray-0", i: 0 },
  { key: "ray-1", i: 1 },
  { key: "ray-2", i: 2 },
  { key: "ray-3", i: 3 },
];

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

    const t1 = setTimeout(() => setPhase("fadein"), 600);
    const t2 = setTimeout(() => setPhase("hold"), 2000);
    const t3 = setTimeout(() => setPhase("fadeout"), 5500);
    const t4 = setTimeout(() => onComplete(), 7000);

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
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('/assets/uploads/b3aaa2d30ad3c2aaa1deb260d2baadc9-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
        }}
      />

      {/* Cinematic top light beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "70%",
          background:
            "radial-gradient(ellipse 50% 80% at 50% 0%, rgba(255,240,200,0.18) 0%, rgba(255,220,150,0.06) 40%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Cinematic side lights */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: 0,
          width: "50%",
          height: "80%",
          background:
            "radial-gradient(ellipse 60% 70% at 0% 40%, rgba(255,220,160,0.10) 0%, transparent 65%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          right: 0,
          width: "50%",
          height: "80%",
          background:
            "radial-gradient(ellipse 60% 70% at 100% 40%, rgba(200,210,255,0.08) 0%, transparent 65%)",
          zIndex: 2,
        }}
      />

      {/* Mist layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <div
          className="absolute"
          style={{
            inset: "-20%",
            background:
              "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)",
            animation: "mistDrift1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            inset: "-20%",
            background:
              "radial-gradient(ellipse 55% 45% at 70% 50%, rgba(255,255,255,0.025) 0%, transparent 65%)",
            animation: "mistDrift2 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* Atmospheric rays */}
      {RAY_CONFIGS.map(({ key, i }) => (
        <div
          key={key}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse ${32 + i * 10}% ${55 + i * 6}% at ${28 + i * 12}% 50%, rgba(200, 200, 220, 0.04) 0%, transparent 70%)`,
            animation: `rayPulse ${3 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
            zIndex: 4,
          }}
        />
      ))}

      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          opacity: 0.15,
          zIndex: 5,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)",
          zIndex: 6,
        }}
      />

      {/* Title */}
      <div className="relative text-center select-none" style={{ zIndex: 10 }}>
        {/* Soft glow behind text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
            transform: "scale(2.5)",
          }}
        />

        <div className="relative">
          {phase !== "dark" && (
            <div className={`overflow-hidden mb-1 ${titleClass}`}>
              <div className="h-px w-32 mx-auto gold-shimmer mb-4" />
            </div>
          )}

          <div className="overflow-hidden">
            <h1
              className={`${
                phase !== "dark" ? "hybe-title-reveal" : "opacity-0"
              } ${phase === "fadeout" ? "hybe-title-fadeout" : ""}`}
              style={{
                fontSize: "clamp(3.8rem, 12vw, 11rem)",
                lineHeight: 1.05,
                fontFamily: "'Corben', cursive",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.25em",
                textShadow:
                  "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 0 100px rgba(255,255,255,0.2)",
              }}
            >
              HYBE MUSIC
            </h1>
          </div>

          {phase !== "dark" && (
            <div className={`overflow-hidden mt-2 ${titleClass}`}>
              <div className="h-px w-48 mx-auto gold-shimmer" />
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
                  marginTop: "0.5rem",
                  fontFamily: "'Tangerine', cursive",
                  fontWeight: 700,
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.5), 0 0 50px rgba(255,255,255,0.2)",
                }}
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
