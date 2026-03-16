import { useState } from "react";

interface Creator {
  name: string;
  role: string;
  faceClaim: string;
  experience: number;
  phone: string;
  whatsapp: string;
  initials: string;
}

const CREATORS: Creator[] = [
  {
    name: "Shrey",
    role: "Founder",
    faceClaim: "Park Jimin",
    experience: 6,
    phone: "+91 8950686616",
    whatsapp: "918950686616",
    initials: "S",
  },
  {
    name: "Yusil d'aquila",
    role: "Admin",
    faceClaim: "Jeon Jungkook",
    experience: 7,
    phone: "+91 87669 16846",
    whatsapp: "918766916846",
    initials: "Y",
  },
  {
    name: "Ayden",
    role: "Admin",
    faceClaim: "Taehyung",
    experience: 6,
    phone: "+91 99174 35656",
    whatsapp: "919917435656",
    initials: "A",
  },
  {
    name: "Ricky",
    role: "Admin",
    faceClaim: "Jung Hoseok",
    experience: 7,
    phone: "+91 90987 44115",
    whatsapp: "919098744115",
    initials: "R",
  },
];

interface CreatorsPanelProps {
  onBack: () => void;
}

export function CreatorsPanel({ onBack }: CreatorsPanelProps) {
  const [hoveredBack, setHoveredBack] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleProfileClick = (wa: string) => {
    window.open(`https://wa.me/${wa}`, "_blank", "noopener,noreferrer");
  };

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
              "radial-gradient(ellipse 100% 60% at 50% 0%, oklch(15 0.05 50 / 0.4) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-8 py-6">
        <button
          type="button"
          data-ocid="creators.back_button"
          onClick={onBack}
          onMouseEnter={() => setHoveredBack(true)}
          onMouseLeave={() => setHoveredBack(false)}
          className="flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase transition-all duration-300 focus:outline-none"
          style={{
            color: hoveredBack
              ? "oklch(75 0.18 50)"
              : "oklch(75 0.18 50 / 0.55)",
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

      {/* Title */}
      <div className="relative z-10 text-center pt-4 pb-10 px-4">
        <p
          className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
          style={{ color: "oklch(75 0.18 50 / 0.5)" }}
        >
          Introducing
        </p>
        <h1
          className="font-cinzel font-bold tracking-[0.2em] uppercase"
          style={{
            fontSize: "clamp(1.6rem, 5vw, 3.5rem)",
            color: "oklch(92 0.01 285)",
            textShadow: "0 0 40px oklch(75 0.18 50 / 0.25)",
          }}
        >
          Creators
        </h1>
        <div className="h-px w-24 mx-auto mt-5 gold-shimmer" />
      </div>

      {/* Profile Cards */}
      <main
        className="relative z-10 flex flex-wrap justify-center gap-6 px-6 pb-16"
        data-ocid="creators.list"
      >
        {CREATORS.map((creator, i) => (
          <button
            type="button"
            key={creator.name}
            data-ocid={`creators.item.${i + 1}`}
            onClick={() => handleProfileClick(creator.whatsapp)}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            className="focus:outline-none"
            style={{ width: "clamp(260px, 40vw, 320px)" }}
          >
            <div
              style={{
                background:
                  hoveredCard === i
                    ? "oklch(8 0.02 50 / 0.95)"
                    : "oklch(5 0.01 50 / 0.9)",
                border:
                  hoveredCard === i
                    ? "1px solid oklch(75 0.18 50 / 0.8)"
                    : "1px solid oklch(75 0.18 50 / 0.35)",
                boxShadow:
                  hoveredCard === i
                    ? "0 0 24px oklch(75 0.18 50 / 0.2), inset 0 0 20px oklch(75 0.18 50 / 0.04)"
                    : "none",
                transition: "all 0.3s ease",
                padding: "28px 24px 24px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {/* Avatar */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="flex items-center justify-center font-cinzel font-bold shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background: "oklch(10 0.04 50)",
                    border: "1.5px solid oklch(75 0.18 50 / 0.6)",
                    fontSize: "1.4rem",
                    color: "oklch(75 0.18 50)",
                    textShadow: "0 0 12px oklch(75 0.18 50 / 0.5)",
                  }}
                >
                  {creator.initials}
                </div>
                <div className="flex-1 pt-1">
                  <h2
                    className="font-cinzel font-bold tracking-wider"
                    style={{
                      fontSize: "1rem",
                      color: "oklch(92 0.01 285)",
                      lineHeight: 1.3,
                    }}
                  >
                    {creator.name}
                  </h2>
                  <span
                    className="font-cinzel text-xs tracking-[0.35em] uppercase mt-1 inline-block"
                    style={{
                      color:
                        creator.role === "Founder"
                          ? "oklch(80 0.18 50)"
                          : "oklch(65 0.13 50 / 0.85)",
                    }}
                  >
                    {creator.role}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-4"
                style={{ background: "oklch(75 0.18 50 / 0.15)" }}
              />

              {/* Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className="font-raleway text-xs tracking-[0.2em] uppercase"
                    style={{ color: "oklch(75 0.18 50 / 0.5)" }}
                  >
                    Face Claim
                  </span>
                  <span
                    className="font-raleway text-xs tracking-wide"
                    style={{ color: "oklch(85 0.05 285 / 0.9)" }}
                  >
                    {creator.faceClaim}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="font-raleway text-xs tracking-[0.2em] uppercase"
                    style={{ color: "oklch(75 0.18 50 / 0.5)" }}
                  >
                    Experience
                  </span>
                  <span
                    className="font-raleway text-xs tracking-wide"
                    style={{ color: "oklch(85 0.05 285 / 0.9)" }}
                  >
                    {creator.experience} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="font-raleway text-xs tracking-[0.2em] uppercase"
                    style={{ color: "oklch(75 0.18 50 / 0.5)" }}
                  >
                    WhatsApp
                  </span>
                  <span
                    className="font-raleway text-xs tracking-wide"
                    style={{ color: "oklch(75 0.18 50 / 0.9)" }}
                  >
                    {creator.phone}
                  </span>
                </div>
              </div>

              {/* CTA hint */}
              <div
                className="mt-5 flex items-center justify-center gap-2"
                style={{
                  opacity: hoveredCard === i ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span
                  className="font-cinzel text-xs tracking-[0.3em] uppercase"
                  style={{ color: "oklch(75 0.18 50 / 0.7)" }}
                >
                  Open WhatsApp ›
                </span>
              </div>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}
