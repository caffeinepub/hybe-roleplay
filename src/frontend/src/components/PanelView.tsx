import { useState } from "react";

interface PanelViewProps {
  label: string;
  icon: string;
  onBack: () => void;
}

export function PanelView({ label, icon, onBack }: PanelViewProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="dashboard-enter min-h-screen flex flex-col"
      style={{ background: "#020204" }}
    >
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 60% at 50% 0%, oklch(15 0.05 285 / 0.6) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-8 py-6">
        <button
          type="button"
          data-ocid="panel.back_button"
          onClick={onBack}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center gap-2 font-raleway text-xs tracking-[0.3em] uppercase transition-all duration-300 focus:outline-none"
          style={{
            color: hovered ? "oklch(75 0.18 50)" : "oklch(75 0.18 50 / 0.6)",
          }}
        >
          ‹ Back
        </button>
        <div
          className="h-px flex-1 opacity-10"
          style={{ background: "oklch(75 0.18 50)" }}
        />
        <span
          className="font-cinzel text-sm tracking-[0.4em] uppercase"
          style={{ color: "oklch(75 0.18 50 / 0.4)" }}
        >
          Hybe Music
        </span>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <div
            className="text-8xl mb-8"
            style={{
              color: "oklch(75 0.18 50)",
              textShadow:
                "0 0 40px oklch(75 0.18 50 / 0.5), 0 0 80px oklch(75 0.18 50 / 0.2)",
            }}
          >
            {icon}
          </div>

          <div className="h-px w-24 mx-auto gold-shimmer mb-8" />

          <h1
            className="font-cinzel font-bold tracking-[0.2em] uppercase"
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              color: "oklch(92 0.01 285)",
            }}
          >
            {label}
          </h1>

          <p
            className="font-raleway mt-6 text-sm tracking-[0.2em] uppercase opacity-40"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Coming soon
          </p>

          <div className="h-px w-24 mx-auto gold-shimmer mt-8" />
        </div>
      </main>
    </div>
  );
}
