import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface Game {
  id: string;
  name: string;
  thumbnail: string;
  link: string;
}

interface GamesPanelProps {
  onBack: () => void;
  adminUnlocked: boolean;
}

const STORAGE_KEY = "hybe_games";

function loadGames(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGames(games: Game[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function GamesPanel({ onBack, adminUnlocked }: GamesPanelProps) {
  const [games, setGames] = useState<Game[]>(loadGames);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");

  useEffect(() => {
    saveGames(games);
  }, [games]);

  const resetForm = () => {
    setFormName("");
    setFormLink("");
    setFormThumbnail("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormThumbnail(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!formName.trim()) return;
    if (editingId) {
      setGames((prev) =>
        prev.map((g) =>
          g.id === editingId
            ? { ...g, name: formName, link: formLink, thumbnail: formThumbnail }
            : g,
        ),
      );
    } else {
      const newGame: Game = {
        id: Date.now().toString(),
        name: formName,
        link: formLink,
        thumbnail: formThumbnail,
      };
      setGames((prev) => [...prev, newGame]);
    }
    resetForm();
  };

  const handleEdit = (game: Game) => {
    setEditingId(game.id);
    setFormName(game.name);
    setFormLink(game.link);
    setFormThumbnail(game.thumbnail);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleCardClick = (game: Game) => {
    if (game.link) {
      window.open(game.link, "_blank", "noopener,noreferrer");
    }
  };

  const glassCard = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    boxShadow: "0 0 12px rgba(255,255,255,0.08)",
  };

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
          data-ocid="games.back_button"
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
          Games
        </h1>
        <div style={{ width: "64px" }} />
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center gap-4 px-6 py-8 pb-16 max-w-lg mx-auto w-full">
        {/* Add Game button */}
        {adminUnlocked && !showForm && (
          <Button
            data-ocid="games.add_button"
            onClick={() => setShowForm(true)}
            className="w-full font-cinzel text-xs tracking-widest uppercase"
            style={{
              ...glassCard,
              color: "oklch(75 0.18 50)",
              border: "1px solid oklch(75 0.18 50 / 0.5)",
              boxShadow: "0 0 14px oklch(75 0.18 50 / 0.1)",
              padding: "10px",
            }}
          >
            + Add Game
          </Button>
        )}

        {/* Add/Edit Form */}
        {showForm && adminUnlocked && (
          <div
            data-ocid="games.dialog"
            className="w-full flex flex-col gap-3 p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(75 0.18 50 / 0.3)",
              borderRadius: "18px",
              boxShadow: "0 0 30px oklch(75 0.18 50 / 0.08)",
            }}
          >
            <h3
              className="font-cinzel text-sm tracking-widest uppercase text-center"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              {editingId ? "Edit Game" : "New Game"}
            </h3>

            {/* Thumbnail upload */}
            <div className="flex flex-col gap-1">
              <span
                className="font-raleway text-xs tracking-widest uppercase opacity-60"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                Thumbnail
              </span>
              {formThumbnail && (
                <img
                  src={formThumbnail}
                  alt="thumbnail preview"
                  className="w-20 h-20 rounded-xl object-cover mb-1"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                />
              )}
              <label
                data-ocid="games.upload_button"
                className="cursor-pointer flex items-center justify-center font-raleway text-xs tracking-wide py-2 px-4 transition-all duration-200 hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {formThumbnail ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </label>
            </div>

            {/* Name input */}
            <Input
              data-ocid="games.input"
              placeholder="Game Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="font-raleway"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.9)",
              }}
            />

            {/* Link input */}
            <Input
              data-ocid="games.input"
              placeholder="Game Link (URL)"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              className="font-raleway"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.9)",
              }}
            />

            <div className="flex gap-2">
              <Button
                data-ocid="games.cancel_button"
                variant="outline"
                className="flex-1 font-cinzel text-xs tracking-widest"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.5)",
                  borderRadius: "12px",
                }}
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                data-ocid="games.save_button"
                className="flex-1 font-cinzel text-xs tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.9)",
                  borderRadius: "12px",
                }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Games list */}
        {games.length === 0 ? (
          <div
            data-ocid="games.empty_state"
            className="w-full flex flex-col items-center justify-center py-16 gap-3"
          >
            <span className="text-4xl opacity-30">🎮</span>
            <p
              className="font-cinzel text-sm tracking-widest text-center opacity-50"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              No games yet.
              <br />
              Check back soon.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3" data-ocid="games.list">
            {games.map((game, i) => (
              <div
                key={game.id}
                data-ocid={`games.item.${i + 1}`}
                className="flex items-center gap-4 p-3 group transition-all duration-300 hover:scale-[1.01]"
                style={glassCard}
              >
                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() => handleCardClick(game)}
                  className="shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:opacity-80"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: game.thumbnail
                      ? "transparent"
                      : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  {game.thumbnail ? (
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-40">🎮</span>
                  )}
                </button>

                {/* Name */}
                <button
                  type="button"
                  onClick={() => handleCardClick(game)}
                  className="flex-1 text-left cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <span
                    className="font-cinzel font-bold tracking-[0.15em] uppercase"
                    style={{
                      color: "rgba(255,255,255,0.88)",
                      fontSize: "0.95rem",
                      textShadow: "0 0 8px rgba(255,255,255,0.2)",
                    }}
                  >
                    {game.name}
                  </span>
                  {game.link && (
                    <p
                      className="font-raleway text-xs mt-1 opacity-40 truncate"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        maxWidth: "160px",
                      }}
                    >
                      {game.link}
                    </p>
                  )}
                </button>

                {/* Admin controls */}
                {adminUnlocked && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      data-ocid={`games.edit_button.${i + 1}`}
                      onClick={() => handleEdit(game)}
                      className="font-raleway text-xs tracking-wide transition-all duration-200 hover:opacity-100"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      data-ocid={`games.delete_button.${i + 1}`}
                      onClick={() => handleDelete(game.id)}
                      className="font-raleway text-xs tracking-wide transition-all duration-200 hover:opacity-100"
                      style={{
                        background: "rgba(255,50,50,0.08)",
                        border: "1px solid rgba(255,80,80,0.25)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        color: "rgba(255,120,120,0.7)",
                        cursor: "pointer",
                      }}
                    >
                      Del
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
