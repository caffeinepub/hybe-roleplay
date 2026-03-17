import { useState } from "react";

interface Creator {
  name: string;
  role: string;
  faceClaim: string;
  experience: number;
  whatsapp: string;
  initials: string;
  image: string;
}

const CREATORS: Creator[] = [
  {
    name: "Shrey",
    role: "Founder",
    faceClaim: "Park Jimin",
    experience: 6,
    whatsapp: "918950686616",
    initials: "S",
    image: "/assets/uploads/b3e936344ded996abc7c9e64336ca124-1-1.jpg",
  },
  {
    name: "Yusil d'aquila",
    role: "Admin",
    faceClaim: "Jeon Jungkook",
    experience: 7,
    whatsapp: "918766916846",
    initials: "Y",
    image: "/assets/uploads/7bc53c4ccb6128e286d2297e14a6aa3d-1-1.jpg",
  },
  {
    name: "Ayden",
    role: "Admin",
    faceClaim: "Taehyung",
    experience: 6,
    whatsapp: "919917435656",
    initials: "A",
    image: "/assets/uploads/99e569e0c6bdb22cb5f052e2c8e54855-2.jpg",
  },
  {
    name: "Ricky",
    role: "Admin",
    faceClaim: "Jung Hoseok",
    experience: 7,
    whatsapp: "919098744115",
    initials: "R",
    image: "/assets/uploads/4ad710a3e52266ca6cf9927486ae6580-1.jpg",
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

      {/* Profile Cards — circular */}
      <main
        className="relative z-10 flex flex-wrap justify-center gap-10 px-6 pb-16"
        data-ocid="creators.list"
      >
        {CREATORS.map((creator, i) => {
          const isRicky = creator.name === "Ricky";
          return (
            <button
              type="button"
              key={creator.name}
              data-ocid={`creators.item.${i + 1}`}
              onClick={() => handleProfileClick(creator.whatsapp)}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className="focus:outline-none flex flex-col items-center gap-4"
              style={{ width: 180 }}
            >
              {/* Circle card */}
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "#000",
                  border:
                    hoveredCard === i
                      ? "2px solid oklch(75 0.18 50 / 0.95)"
                      : "2px solid oklch(75 0.18 50 / 0.45)",
                  boxShadow:
                    hoveredCard === i
                      ? "0 0 32px oklch(75 0.18 50 / 0.55), 0 0 64px oklch(75 0.18 50 / 0.2), inset 0 0 24px oklch(75 0.18 50 / 0.06)"
                      : "0 0 18px oklch(75 0.18 50 / 0.25), inset 0 0 12px oklch(75 0.18 50 / 0.03)",
                  transition: "all 0.35s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Profile image */}
                <img
                  src={creator.image}
                  alt={creator.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: isRicky ? "center 20%" : "top center",
                    borderRadius: "50%",
                    display: "block",
                    transform: isRicky ? "scale(1.2)" : undefined,
                    transformOrigin: isRicky ? "center 20%" : undefined,
                  }}
                />
                {/* Hover overlay with tap hint */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "oklch(0 0 0 / 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredCard === i ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span
                    className="font-cinzel text-xs tracking-[0.25em] uppercase"
                    style={{
                      color: "oklch(75 0.18 50)",
                      fontSize: "0.55rem",
                    }}
                  >
                    tap to chat
                  </span>
                </div>
              </div>

              {/* Name & role below circle */}
              <div className="text-center">
                <p
                  className="font-cinzel font-bold tracking-wider"
                  style={{
                    fontSize: "0.85rem",
                    color: "oklch(92 0.01 285)",
                    lineHeight: 1.3,
                  }}
                >
                  {creator.name}
                </p>
                <p
                  className="font-cinzel text-xs tracking-[0.3em] uppercase mt-1"
                  style={{
                    color:
                      creator.role === "Founder"
                        ? "oklch(80 0.18 50)"
                        : "oklch(65 0.13 50 / 0.85)",
                  }}
                >
                  {creator.role}
                </p>
                <p
                  className="font-raleway text-xs mt-2"
                  style={{ color: "oklch(70 0.04 285 / 0.7)" }}
                >
                  {creator.faceClaim}
                </p>
                <p
                  className="font-raleway text-xs mt-1"
                  style={{ color: "oklch(65 0.1 50 / 0.6)" }}
                >
                  {creator.experience} yrs exp
                </p>
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
