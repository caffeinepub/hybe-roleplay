import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Highlight {
  id: string;
  title: string;
  caption: string;
  imageDataUrl: string;
}

const STORAGE_KEY = "highlights_data";
const ADMIN_PIN = "hybe2024";

function loadHighlights(): Highlight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHighlights(items: Highlight[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function HighlightsPanel({ onBack }: { onBack: () => void }) {
  const [highlights, setHighlights] = useState<Highlight[]>(loadHighlights);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Add/Edit form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCaption, setFormCaption] = useState("");
  const [formImage, setFormImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const highlightsLenRef = useRef(highlights.length);

  useEffect(() => {
    highlightsLenRef.current = highlights.length;
  }, [highlights.length]);

  useEffect(() => {
    saveHighlights(highlights);
  }, [highlights]);

  // Auto-scroll carousel every 2 seconds
  useEffect(() => {
    if (highlights.length <= 1) return;
    autoTimer.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % highlightsLenRef.current);
        setIsTransitioning(false);
      }, 400);
    }, 2000);
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [highlights.length]);

  const goTo = (idx: number) => {
    if (idx === currentIndex) return;
    if (autoTimer.current) clearInterval(autoTimer.current);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsTransitioning(false);
    }, 400);
  };

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinInput(false);
      setPin("");
      setPinError("");
    } else {
      setPinError("Incorrect PIN");
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormCaption("");
    setFormImage("");
    setShowForm(true);
  };

  const openEditForm = (h: Highlight) => {
    setEditingId(h.id);
    setFormTitle(h.title);
    setFormCaption(h.caption);
    setFormImage(h.imageDataUrl);
    setShowForm(true);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formImage) return;
    if (editingId) {
      setHighlights((prev) =>
        prev.map((h) =>
          h.id === editingId
            ? {
                ...h,
                title: formTitle,
                caption: formCaption,
                imageDataUrl: formImage,
              }
            : h,
        ),
      );
    } else {
      const newItem: Highlight = {
        id: Date.now().toString(),
        title: formTitle,
        caption: formCaption,
        imageDataUrl: formImage,
      };
      setHighlights((prev) => [newItem, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    setCurrentIndex(0);
  };

  const currentHighlight = highlights[currentIndex] ?? highlights[0];

  return (
    <div
      className="min-h-screen w-full relative"
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
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Header — glass mirror */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-5"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid oklch(75 0.18 50 / 0.12)",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <button
          type="button"
          data-ocid="highlights.button"
          onClick={onBack}
          className="font-cinzel text-sm tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <div
            className="h-px w-6"
            style={{ background: "oklch(75 0.18 50 / 0.4)" }}
          />
          <span
            className="font-cinzel text-sm tracking-[0.4em] uppercase"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Highlights
          </span>
          <div
            className="h-px w-6"
            style={{ background: "oklch(75 0.18 50 / 0.4)" }}
          />
        </div>

        {/* Admin button */}
        {!isAdmin ? (
          <button
            type="button"
            data-ocid="highlights.open_modal_button"
            onClick={() => {
              setShowPinInput(!showPinInput);
              setPinError("");
              setPin("");
            }}
            className="font-cinzel text-xs tracking-[0.25em] uppercase px-3 py-1 transition-all hover:opacity-80"
            style={{
              color: "oklch(75 0.18 50)",
              border: "1px solid oklch(75 0.18 50 / 0.4)",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)",
            }}
          >
            [ Admin ]
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className="font-cinzel text-xs tracking-[0.25em] uppercase px-3 py-1 transition-all hover:opacity-80"
            style={{
              color: "oklch(75 0.18 50)",
              border: "1px solid oklch(75 0.18 50 / 0.6)",
              background: "oklch(75 0.18 50 / 0.08)",
              borderRadius: "8px",
            }}
          >
            [ Exit Admin ]
          </button>
        )}
      </header>

      {/* Inline PIN input */}
      {showPinInput && (
        <div
          data-ocid="highlights.panel"
          className="relative z-20 mx-6 mb-4 mt-4 p-4 flex flex-col gap-3"
          style={{
            border: "1px solid oklch(75 0.18 50 / 0.3)",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            borderRadius: "12px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="font-cinzel text-xs tracking-[0.3em] uppercase text-center"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Enter Admin PIN
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              data-ocid="highlights.input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="PIN"
              className="flex-1 bg-transparent font-cinzel text-sm tracking-[0.3em] text-center outline-none px-3 py-2"
              style={{
                color: "oklch(75 0.18 50)",
                border: "1px solid oklch(75 0.18 50 / 0.4)",
                borderRadius: "8px",
              }}
            />
            <button
              type="button"
              data-ocid="highlights.confirm_button"
              onClick={handlePinSubmit}
              className="font-cinzel text-xs tracking-[0.2em] uppercase px-4 py-2 transition-all hover:opacity-80"
              style={{
                color: "#000",
                background: "oklch(75 0.18 50)",
                borderRadius: "8px",
                boxShadow: "0 0 12px oklch(75 0.18 50 / 0.4)",
              }}
            >
              Enter
            </button>
          </div>
          {pinError && (
            <p
              data-ocid="highlights.error_state"
              className="font-raleway text-xs text-center"
              style={{ color: "oklch(60 0.22 25)" }}
            >
              {pinError}
            </p>
          )}
        </div>
      )}

      {/* Admin: Add Highlight button */}
      {isAdmin && (
        <div className="relative z-10 flex justify-center mb-4 mt-4 px-6">
          <button
            type="button"
            data-ocid="highlights.primary_button"
            onClick={openAddForm}
            className="flex items-center gap-2 font-cinzel text-sm tracking-[0.25em] uppercase px-6 py-3 transition-all hover:opacity-80"
            style={{
              color: "#000",
              background: "oklch(75 0.18 50)",
              borderRadius: "10px",
              boxShadow: "0 0 16px oklch(75 0.18 50 / 0.45)",
            }}
          >
            <ImagePlus size={14} />
            Add Highlight
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 px-4 pb-16">
        {highlights.length === 0 ? (
          <div
            data-ocid="highlights.empty_state"
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <div
              className="h-px w-32 mx-auto"
              style={{ background: "oklch(75 0.18 50 / 0.3)" }}
            />
            <p
              className="font-cinzel text-base tracking-[0.3em] uppercase text-center"
              style={{ color: "oklch(75 0.18 50 / 0.4)" }}
            >
              No Highlights Yet
            </p>
            <p
              className="font-raleway text-xs tracking-widest text-center"
              style={{ color: "oklch(75 0.18 50 / 0.25)" }}
            >
              Captured moments will appear here
            </p>
            <div
              className="h-px w-32 mx-auto"
              style={{ background: "oklch(75 0.18 50 / 0.3)" }}
            />
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Carousel - full bleed single card */}
            <div
              className="relative overflow-hidden"
              style={{
                height: "55vh",
                minHeight: "300px",
                borderRadius: "16px",
                border: "1px solid oklch(75 0.18 50 / 0.35)",
                boxShadow:
                  "0 0 40px oklch(75 0.18 50 / 0.12), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {currentHighlight && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url('${currentHighlight.imageDataUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isTransitioning ? 0 : 1,
                    transition: "opacity 0.4s ease",
                    borderRadius: "16px",
                  }}
                />
              )}
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)",
                  borderRadius: "16px",
                }}
              />

              {/* Text overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "1.5rem",
                  opacity: isTransitioning ? 0 : 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                <h3
                  className="font-cinzel font-bold tracking-[0.15em] uppercase mb-1"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                    color: "oklch(75 0.18 50)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                  }}
                >
                  {currentHighlight?.title}
                </h3>
                {currentHighlight?.caption && (
                  <p
                    className="font-raleway text-sm tracking-wider"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {currentHighlight.caption}
                  </p>
                )}
              </div>

              {/* Admin controls on slide */}
              {isAdmin && currentHighlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    data-ocid={`highlights.edit_button.${currentIndex + 1}`}
                    onClick={() => openEditForm(currentHighlight)}
                    className="p-2 transition-all hover:opacity-80"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid oklch(75 0.18 50 / 0.5)",
                      color: "oklch(75 0.18 50)",
                      borderRadius: "8px",
                    }}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    data-ocid={`highlights.delete_button.${currentIndex + 1}`}
                    onClick={() => handleDelete(currentHighlight.id)}
                    className="p-2 transition-all hover:opacity-80"
                    style={{
                      background: "oklch(30 0.15 25 / 0.3)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid oklch(60 0.2 25 / 0.5)",
                      color: "oklch(70 0.18 25)",
                      borderRadius: "8px",
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {/* Dot indicators */}
              {highlights.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.25rem",
                    right: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    zIndex: 10,
                  }}
                >
                  {highlights.map((h, i) => (
                    <button
                      type="button"
                      key={h.id}
                      data-ocid={`highlights.toggle.${i + 1}`}
                      onClick={() => goTo(i)}
                      style={{
                        width: i === currentIndex ? "24px" : "8px",
                        height: "8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        background:
                          i === currentIndex
                            ? "oklch(75 0.18 50)"
                            : "oklch(75 0.18 50 / 0.35)",
                        boxShadow:
                          i === currentIndex
                            ? "0 0 8px oklch(75 0.18 50 / 0.6)"
                            : "none",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {highlights.length > 1 && (
              <div
                className="flex gap-3 mt-4 overflow-x-auto pb-2"
                data-ocid="highlights.list"
                style={{ scrollbarWidth: "none" }}
              >
                {highlights.map((h, i) => (
                  <button
                    type="button"
                    key={h.id}
                    data-ocid={`highlights.item.${i + 1}`}
                    onClick={() => goTo(i)}
                    className="shrink-0 transition-all duration-300"
                    style={{
                      width: "72px",
                      height: "52px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border:
                        i === currentIndex
                          ? "2px solid oklch(75 0.18 50)"
                          : "2px solid oklch(75 0.18 50 / 0.25)",
                      boxShadow:
                        i === currentIndex
                          ? "0 0 12px oklch(75 0.18 50 / 0.5)"
                          : "none",
                      opacity: i === currentIndex ? 1 : 0.55,
                    }}
                  >
                    <img
                      src={h.imageDataUrl}
                      alt={h.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          data-ocid="highlights.modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-full max-w-md p-6 flex flex-col gap-4"
            style={{
              background: "rgba(10, 8, 4, 0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid oklch(75 0.18 50 / 0.4)",
              borderRadius: "16px",
              boxShadow:
                "0 0 48px oklch(75 0.18 50 / 0.1), 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2
                className="font-cinzel text-sm tracking-[0.3em] uppercase"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                {editingId ? "Edit Highlight" : "New Highlight"}
              </h2>
              <button
                type="button"
                data-ocid="highlights.close_button"
                onClick={() => setShowForm(false)}
                className="transition-opacity hover:opacity-60 p-1"
                style={{ color: "oklch(75 0.18 50)", borderRadius: "6px" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Image upload */}
            <div>
              <label
                htmlFor="highlight-photo-input"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Photo
              </label>
              <label
                htmlFor="highlight-photo-input"
                data-ocid="highlights.dropzone"
                className="relative flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                style={{
                  border: "1px dashed oklch(75 0.18 50 / 0.4)",
                  minHeight: "100px",
                  background: "oklch(75 0.18 50 / 0.03)",
                  display: "flex",
                  borderRadius: "10px",
                }}
              >
                {formImage ? (
                  <img
                    src={formImage}
                    alt="preview"
                    className="w-full max-h-48 object-cover"
                    style={{ borderRadius: "10px" }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <ImagePlus
                      size={20}
                      style={{ color: "oklch(75 0.18 50 / 0.5)" }}
                    />
                    <span
                      className="font-raleway text-xs tracking-wider"
                      style={{ color: "oklch(75 0.18 50 / 0.4)" }}
                    >
                      Click to upload photo
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="highlight-photo-input"
                  type="file"
                  data-ocid="highlights.upload_button"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="highlight-title-input"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Title
              </label>
              <input
                id="highlight-title-input"
                type="text"
                data-ocid="highlights.input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Highlight title"
                className="w-full bg-transparent font-raleway text-sm px-3 py-2 outline-none"
                style={{
                  color: "oklch(90 0.05 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            {/* Caption */}
            <div>
              <label
                htmlFor="highlight-caption-input"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Caption <span className="opacity-40">(optional)</span>
              </label>
              <textarea
                id="highlight-caption-input"
                data-ocid="highlights.textarea"
                value={formCaption}
                onChange={(e) => setFormCaption(e.target.value)}
                placeholder="A brief caption..."
                rows={2}
                className="w-full bg-transparent font-raleway text-sm px-3 py-2 outline-none resize-none"
                style={{
                  color: "oklch(90 0.05 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                data-ocid="highlights.cancel_button"
                onClick={() => setShowForm(false)}
                className="flex-1 font-cinzel text-xs tracking-[0.2em] uppercase py-3 transition-all hover:opacity-70"
                style={{
                  color: "oklch(75 0.18 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                  borderRadius: "8px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="highlights.save_button"
                onClick={handleSave}
                disabled={!formTitle.trim() || !formImage}
                className="flex-1 font-cinzel text-xs tracking-[0.2em] uppercase py-3 transition-all hover:opacity-80 disabled:opacity-30"
                style={{
                  color: "#000",
                  background: "oklch(75 0.18 50)",
                  borderRadius: "8px",
                  boxShadow: "0 0 14px oklch(75 0.18 50 / 0.4)",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
