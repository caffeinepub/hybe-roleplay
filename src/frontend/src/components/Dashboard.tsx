import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AuditionFlow } from "./AuditionFlow";
import { CreatorsPanel } from "./CreatorsPanel";
import { ElementsPanel } from "./ElementsPanel";
import { EventsPanel } from "./EventsPanel";
import { GamesPanel } from "./GamesPanel";
import { GreetingCarousel } from "./GreetingCarousel";
import { HighlightsPanel } from "./HighlightsPanel";

const ADMIN_PIN = "hybe2024";

type PanelId =
  | "creators"
  | "inventory"
  | "elements"
  | "events"
  | "channel"
  | "highlights"
  | "games";

interface Panel {
  id: PanelId;
  label: string;
  icon: string;
  description: string;
  ocid: string;
  delay: string;
  externalUrl?: string;
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
    delay: "120ms",
  },
  {
    id: "elements",
    label: "Elements",
    icon: "⬡",
    description: "Forces of the realm",
    ocid: "dashboard.elements_panel",
    delay: "240ms",
  },
  {
    id: "events",
    label: "Events",
    icon: "◎",
    description: "Chronicles & quests",
    ocid: "dashboard.events_panel",
    delay: "360ms",
  },
  {
    id: "channel",
    label: "Channel",
    icon: "⊹",
    description: "Join our WhatsApp channel",
    ocid: "dashboard.channel_panel",
    delay: "480ms",
    externalUrl: "https://whatsapp.com/channel/0029VbCEwmU4dTnRdoJutS08",
  },
  {
    id: "highlights",
    label: "Highlights",
    icon: "◉",
    description: "Captured moments",
    ocid: "dashboard.highlights_panel",
    delay: "600ms",
  },
];

export function Dashboard({ visible }: { visible: boolean }) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

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
    return <EventsPanel onBack={() => setActivePanel(null)} />;
  }

  if (activePanel === "highlights") {
    return <HighlightsPanel onBack={() => setActivePanel(null)} />;
  }

  if (activePanel === "games") {
    return (
      <GamesPanel
        onBack={() => setActivePanel(null)}
        adminUnlocked={adminUnlocked}
      />
    );
  }

  const handlePanelClick = (panel: Panel) => {
    if (panel.externalUrl) {
      window.open(panel.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setActivePanel(panel.id);
    }
  };

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      setAdminUnlocked(true);
      setShowPinDialog(false);
      setPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden"
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

      {/* Header — glass mirror */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-6"
        style={{
          animation: "headerReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid oklch(75 0.18 50 / 0.12)",
          borderRadius: "0 0 16px 16px",
        }}
      >
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
        <div className="flex items-center gap-4">
          <div
            className="font-raleway text-xs tracking-[0.3em] uppercase opacity-40"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            The elements era
          </div>
          {/* Admin button — always in header, always above panels */}
          <button
            type="button"
            data-ocid="greeting.admin_button"
            onClick={() =>
              adminUnlocked ? setAdminUnlocked(false) : setShowPinDialog(true)
            }
            className="font-cinzel text-xs tracking-widest uppercase transition-all duration-200 hover:opacity-100"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(75 0.18 50 / 0.35)",
              borderRadius: "20px",
              padding: "4px 14px",
              color: "oklch(75 0.18 50)",
              opacity: adminUnlocked ? 1 : 0.7,
              cursor: "pointer",
            }}
          >
            {adminUnlocked ? "Exit Admin" : "Admin"}
          </button>
        </div>
      </header>

      {/* PIN Dialog — fixed overlay, always on top */}
      {showPinDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-xs mx-4 p-6 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(75 0.18 50 / 0.35)",
              borderRadius: "18px",
              boxShadow: "0 0 40px oklch(75 0.18 50 / 0.12)",
            }}
          >
            <h3
              className="font-cinzel text-center tracking-widest uppercase text-sm"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              Admin Access
            </h3>
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              data-ocid="greeting.pin_input"
              className="text-center tracking-widest font-cinzel"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: pinError
                  ? "1px solid oklch(60 0.2 25)"
                  : "1px solid oklch(75 0.18 50 / 0.3)",
                borderRadius: "10px",
                color: "oklch(75 0.18 50)",
              }}
            />
            {pinError && (
              <p
                className="text-center text-xs font-raleway"
                style={{ color: "oklch(60 0.2 25)" }}
              >
                Incorrect PIN
              </p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-cinzel text-xs tracking-widest"
                style={{
                  background: "transparent",
                  border: "1px solid oklch(75 0.18 50 / 0.25)",
                  color: "oklch(75 0.18 50 / 0.6)",
                  borderRadius: "10px",
                }}
                onClick={() => {
                  setShowPinDialog(false);
                  setPin("");
                  setPinError(false);
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="greeting.pin_submit_button"
                className="flex-1 font-cinzel text-xs tracking-widest"
                style={{
                  background: "oklch(75 0.18 50 / 0.15)",
                  border: "1px solid oklch(75 0.18 50 / 0.5)",
                  color: "oklch(75 0.18 50)",
                  borderRadius: "10px",
                }}
                onClick={handlePinSubmit}
              >
                Unlock
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Games button — between header and greeting carousel */}
      <div className="relative z-10 flex justify-center px-6 mt-4">
        <button
          type="button"
          data-ocid="dashboard.games_button"
          onClick={() => setActivePanel("games")}
          className="w-full max-w-lg font-cinzel text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:scale-[1.01] hover:opacity-90 py-3 px-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "20px",
            boxShadow: "0 0 14px rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.85)",
            cursor: "pointer",
          }}
        >
          🎮 Games
        </button>
      </div>

      {/* Greeting Carousel — passes admin state down */}
      <GreetingCarousel
        adminUnlocked={adminUnlocked}
        onAdminToggle={() => setAdminUnlocked(false)}
      />

      {/* Hero text */}
      <div
        className="relative z-10 text-center pt-6 pb-8 px-4"
        style={{
          animation:
            "headerReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) 80ms both",
        }}
      >
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
      <main className="relative z-10 flex flex-col items-center gap-3 px-6 pb-12">
        {PANELS.map((panel) => (
          <button
            type="button"
            key={panel.id}
            data-ocid={panel.ocid}
            onClick={() => handlePanelClick(panel)}
            className="panel-button group w-full max-w-lg flex items-center gap-4 px-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            style={{
              animationDelay: panel.delay,
              height: "64px",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(16px) saturate(160%)",
              WebkitBackdropFilter: "blur(16px) saturate(160%)",
              border: "1px solid oklch(75 0.18 50 / 0.35)",
              borderRadius: "14px",
              transition:
                "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
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
