interface TokenPanelProps {
  onBack: () => void;
}

const DEFAULT_TOKENS = [
  {
    id: "hybe-token-portal",
    name: "HYBE Music Token Portal",
    thumbnail: "",
    link: "https://hybe-music-token-portal-uat.caffeine.xyz",
  },
];

export function TokenPanel({ onBack }: TokenPanelProps) {
  const storedRaw =
    typeof window !== "undefined" ? localStorage.getItem("hybe_tokens") : null;
  let tokens = DEFAULT_TOKENS;
  if (storedRaw) {
    try {
      const parsed = JSON.parse(storedRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        tokens = parsed;
      }
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "#000000" }}
    >
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 60% at 50% 0%, oklch(15 0.07 50 / 0.2) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative z-10 flex items-center gap-4 px-6 py-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid oklch(75 0.18 50 / 0.12)",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <button
          type="button"
          data-ocid="token.back_button"
          onClick={onBack}
          className="font-cinzel text-xs tracking-widest uppercase transition-all duration-200 hover:opacity-100"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid oklch(75 0.18 50 / 0.35)",
            borderRadius: "20px",
            padding: "4px 14px",
            color: "oklch(75 0.18 50)",
            opacity: 0.8,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h1
          className="font-cinzel font-bold tracking-[0.3em] uppercase flex-1 text-center"
          style={{ color: "oklch(75 0.18 50)", fontSize: "1.2rem" }}
        >
          Token
        </h1>
        <div style={{ width: "64px" }} />
      </header>

      {/* Token list */}
      <main className="relative z-10 flex flex-col items-center px-6 py-10 gap-4 flex-1">
        {tokens.map((token) => (
          <a
            key={token.id}
            href={token.link}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`token.item_${token.id}`}
            className="w-full max-w-md flex items-center gap-4 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid oklch(75 0.18 50 / 0.25)",
              borderRadius: "16px",
              padding: "14px 18px",
              boxShadow: "0 0 12px oklch(75 0.18 50 / 0.08)",
              textDecoration: "none",
            }}
          >
            {token.thumbnail ? (
              <img
                src={token.thumbnail}
                alt={token.name}
                className="rounded-xl object-cover flex-shrink-0"
                style={{ width: 52, height: 52 }}
              />
            ) : (
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid oklch(75 0.18 50 / 0.2)",
                  color: "oklch(75 0.18 50)",
                  fontSize: "1.4rem",
                }}
              >
                ◈
              </div>
            )}
            <span
              className="font-cinzel text-sm tracking-wider"
              style={{
                color: "oklch(75 0.18 50)",
                textShadow: "0 0 8px oklch(75 0.18 50 / 0.3)",
              }}
            >
              {token.name}
            </span>
            <span
              className="ml-auto text-xs opacity-40"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              ↗
            </span>
          </a>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-4 mt-auto">
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
