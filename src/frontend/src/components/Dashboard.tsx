import { useState } from "react";
import { AuditionFlow } from "./AuditionFlow";
import { CarnivalPanel } from "./CarnivalPanel";
import { CreatorsPanel } from "./CreatorsPanel";
import { ElementsPanel } from "./ElementsPanel";

type PanelId = "creators" | "inventory" | "elements" | "events";

interface Panel {
  id: PanelId;
  label: string;
  icon: string;
  description: string;
  ocid: string;
  delay: string;
}

const PANELS: Panel[] = [
  {
    id: "creators",
    label: "Creators",
    icon: "✦",
    description: "The architects of worlds",
    ocid: "dashboard.creators_panel",
    delay: "0ms",
  },
  {
    id: "inventory",
    label: "Audition",
    icon: "◈",
    description: "Audition for Season 2",
    ocid: "dashboard.inventory_panel",
    delay: "80ms",
  },
  {
    id: "elements",
    label: "Elements",
    icon: "⬡",
    description: "Forces of the realm",
    ocid: "dashboard.elements_panel",
    delay: "160ms",
  },
  {
    id: "events",
    label: "Events",
    icon: "◎",
    description: "Chronicles & quests",
    ocid: "dashboard.events_panel",
    delay: "240ms",
  },
];

export function Dashboard({ visible }: { visible: boolean }) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);

  if (!visible) return null;

  if (activePanel === "inventory") {
    return <AuditionFlow onBack={() => setActivePanel(null)} />;
  }

  if (activePanel === "creators") {
    return <CreatorsPanel onBack={() => setActivePanel(null)} />;
  }

  if (activePanel === "elements") {
    return <ElementsPanel onBack={() => setActivePanel(null)} />;
  }

  if (activePanel === "events") {
    return <CarnivalPanel onComplete={() => setActivePanel(null)} />;
  }

  return (
    <div
      className="dashboard-enter min-h-screen w-full overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 60% at 50% 0%, oklch(15 0.07 50 / 0.25) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "radial-gradient(ellipse 100% 100% at 50% 100%, oklch(75 0.18 50 / 0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 gold-shimmer" />
          <span
            className="font-cinzel text-sm tracking-[0.4em] uppercase"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Hybe Music
          </span>
          <div className="h-px w-8 gold-shimmer" />
        </div>
        <div
          className="font-raleway text-xs tracking-[0.3em] uppercase opacity-40"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          The elements era
        </div>
      </header>

      {/* Hero text */}
      <div className="relative z-10 text-center pt-8 pb-10 px-4">
        <h2
          className="font-cinzel font-bold tracking-[0.15em] uppercase"
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            color: "oklch(75 0.18 50)",
            opacity: 0.9,
          }}
        >
          Welcome to Season 2
        </h2>
        <div className="h-px w-24 mx-auto mt-4 gold-shimmer" />
      </div>

      {/* Panel Buttons */}
      <main className="relative z-10 flex flex-col items-center gap-4 px-6 pb-12">
        {PANELS.map((panel) => (
          <button
            type="button"
            key={panel.id}
            data-ocid={panel.ocid}
            onClick={() => setActivePanel(panel.id)}
            className="panel-button group w-full max-w-lg flex items-center gap-4 px-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            style={{
              animationDelay: panel.delay,
              height: "80px",
              background: "#000000",
              border: "1px solid oklch(75 0.18 50 / 0.5)",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
          >
            <span
              className="text-2xl shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{
                color: "oklch(75 0.18 50)",
                textShadow: "0 0 12px oklch(75 0.18 50 / 0.5)",
                width: "2rem",
                textAlign: "center",
              }}
            >
              {panel.icon}
            </span>

            <span
              className="flex-1 text-center font-cinzel font-bold tracking-[0.25em] uppercase"
              style={{
                fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                color: "oklch(75 0.18 50)",
              }}
            >
              {panel.label}
            </span>

            <span
              className="font-raleway text-xs tracking-widest uppercase opacity-0 group-hover:opacity-50 transition-opacity duration-300 hidden sm:block"
              style={{
                color: "oklch(75 0.18 50)",
                width: "8rem",
                textAlign: "right",
              }}
            >
              {panel.description}
            </span>

            <span
              className="shrink-0 text-sm opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              ›
            </span>
          </button>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-4">
        <div className="h-px w-32 mx-auto gold-shimmer mb-6" />
        <p
          className="font-raleway text-xs tracking-widest opacity-30"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
