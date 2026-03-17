import { useEffect, useState } from "react";

interface CarnivalPanelProps {
  onComplete: () => void;
}

export function CarnivalPanel({ onComplete }: CarnivalPanelProps) {
  const [phase, setPhase] = useState<
    "flash" | "reveal" | "subtext" | "hold" | "exit"
  >("flash");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 300);
    const t2 = setTimeout(() => setPhase("subtext"), 1100);
    const t3 = setTimeout(() => setPhase("hold"), 1800);
    const t4 = setTimeout(() => setPhase("exit"), 3200);
    const t5 = setTimeout(() => onComplete(), 4000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      data-ocid="carnival.panel"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        overflow: "hidden",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "none",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('/assets/uploads/Untitled82_20260307173415-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: phase === "flash" ? 0 : 0.85,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Netflix-style white flash */}
      {phase === "flash" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            animation: "carnival-flash 0.3s ease-out forwards",
          }}
        />
      )}

      {/* Purple bloom overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(25 0.12 305 / 0.45) 0%, transparent 70%)",
          opacity: phase === "flash" ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
        }}
      />

      {/* Scan-line texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0 0 0 / 0.15) 3px, oklch(0 0 0 / 0.15) 4px)",
          pointerEvents: "none",
          opacity: 0.3,
        }}
      />

      {/* CARNIVAL text */}
      <div
        style={{
          position: "relative",
          transform:
            phase === "flash"
              ? "scale(3) translateY(0)"
              : phase === "reveal" || phase === "subtext" || phase === "hold"
                ? "scale(1) translateY(0)"
                : "scale(0.9) translateY(-10px)",
          opacity: phase === "flash" ? 0 : 1,
          transition:
            phase === "reveal"
              ? "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease"
              : "transform 0.5s ease, opacity 0.5s ease",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Bangers', 'Impact', 'Arial Black', sans-serif",
            fontSize: "clamp(5rem, 20vw, 14rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            lineHeight: 1,
            color: "#fff",
            WebkitTextStroke: "3px oklch(65 0.25 305)",
            textShadow: [
              "0 0 20px oklch(65 0.28 305)",
              "0 0 40px oklch(65 0.28 305 / 0.8)",
              "0 0 80px oklch(65 0.28 305 / 0.6)",
              "0 0 140px oklch(55 0.25 305 / 0.4)",
              "4px 4px 0px oklch(30 0.15 305)",
              "-2px -2px 0px oklch(30 0.15 305)",
            ].join(", "),
            userSelect: "none",
            animation:
              phase === "hold" || phase === "exit"
                ? "carnival-pulse 2s ease-in-out infinite"
                : "none",
          }}
        >
          CARNIVAL
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#ffffff",
            marginTop: "1.2rem",
            opacity: phase === "subtext" || phase === "hold" ? 1 : 0,
            transform:
              phase === "subtext" || phase === "hold"
                ? "translateY(0)"
                : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            textShadow: "0 0 20px oklch(65 0.25 305 / 0.5)",
          }}
        >
          coming soon
        </p>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

        @keyframes carnival-flash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes carnival-pulse {
          0%, 100% {
            text-shadow:
              0 0 20px oklch(65 0.28 305),
              0 0 40px oklch(65 0.28 305 / 0.8),
              0 0 80px oklch(65 0.28 305 / 0.6),
              0 0 140px oklch(55 0.25 305 / 0.4),
              4px 4px 0px oklch(30 0.15 305),
              -2px -2px 0px oklch(30 0.15 305);
          }
          50% {
            text-shadow:
              0 0 30px oklch(70 0.30 305),
              0 0 60px oklch(70 0.30 305 / 0.9),
              0 0 100px oklch(65 0.28 305 / 0.8),
              0 0 180px oklch(55 0.25 305 / 0.6),
              4px 4px 0px oklch(30 0.15 305),
              -2px -2px 0px oklch(30 0.15 305);
          }
        }
      `}</style>
    </div>
  );
}
