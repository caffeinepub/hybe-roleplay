import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EventItem {
  id: string;
  title: string;
  status: string;
  description: string;
  backgroundImage: string;
}

const STORAGE_KEY = "events_data";
const ADMIN_PIN = "hybe2024";

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "carnival",
    title: "Carnival",
    status: "coming soon",
    description:
      "The stage is set. The lights are blinding. Carnival is not just an event \u2014 it is a fever dream you never want to leave. Chaos, colour, and something electric in the air. This is where legends are made.",
    backgroundImage: "/assets/generated/carnival-cinematic-bg.dim_1200x800.jpg",
  },
];

function loadEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_EVENTS;
}

function saveEvents(items: EventItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function EventsPanel({ onBack }: { onBack: () => void }) {
  const [events, setEvents] = useState<EventItem[]>(loadEvents);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState("coming soon");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventsLenRef = useRef(events.length);

  useEffect(() => {
    eventsLenRef.current = events.length;
  }, [events.length]);

  // Curtain animation on mount
  useEffect(() => {
    const t = setTimeout(() => setCurtainOpen(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (events.length <= 1) return;
    autoTimer.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % eventsLenRef.current);
        setIsTransitioning(false);
      }, 400);
    }, 4000);
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [events.length]);

  const goTo = (idx: number) => {
    if (idx === currentIndex) return;
    if (autoTimer.current) clearInterval(autoTimer.current);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const currentEvent = events[currentIndex] ?? events[0];

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
    setFormStatus("coming soon");
    setFormDescription("");
    setFormImage("");
    setShowForm(true);
  };

  const openEditForm = (ev: EventItem) => {
    setEditingId(ev.id);
    setFormTitle(ev.title);
    setFormStatus(ev.status);
    setFormDescription(ev.description);
    setFormImage(ev.backgroundImage);
    setShowForm(true);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                title: formTitle,
                status: formStatus,
                description: formDescription,
                backgroundImage: formImage || ev.backgroundImage,
              }
            : ev,
        ),
      );
    } else {
      const newEv: EventItem = {
        id: Date.now().toString(),
        title: formTitle,
        status: formStatus,
        description: formDescription,
        backgroundImage:
          formImage ||
          "/assets/generated/carnival-cinematic-bg.dim_1200x800.jpg",
      };
      setEvents((prev) => [...prev, newEv]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => {
      const next = prev.filter((ev) => ev.id !== id);
      return next.length > 0 ? next : DEFAULT_EVENTS;
    });
    setCurrentIndex(0);
  };

  return (
    <div
      data-ocid="events.panel"
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Left curtain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "50%",
          zIndex: 50,
          transform: curtainOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
          background:
            "linear-gradient(to right, #0a0000 0%, #1a0505 60%, #2d0808 80%, #3a0a0a 90%, #1a0505 100%)",
          boxShadow: curtainOpen ? "none" : "8px 0 40px rgba(0,0,0,0.8)",
          pointerEvents: curtainOpen ? "none" : "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 28px, rgba(0,0,0,0.25) 28px, rgba(0,0,0,0.25) 30px, transparent 30px, transparent 60px, rgba(255,200,50,0.03) 60px, rgba(255,200,50,0.03) 61px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, oklch(75 0.18 50) 20%, oklch(65 0.22 50) 50%, oklch(75 0.18 50) 80%, transparent)",
            boxShadow:
              "0 0 12px oklch(75 0.18 50 / 0.6), 0 0 24px oklch(75 0.18 50 / 0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background:
              "linear-gradient(to bottom, oklch(75 0.18 50 / 0.8), transparent)",
          }}
        />
      </div>

      {/* Right curtain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          left: "50%",
          width: "50%",
          zIndex: 50,
          transform: curtainOpen ? "translateX(100%)" : "translateX(0)",
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
          background:
            "linear-gradient(to left, #0a0000 0%, #1a0505 60%, #2d0808 80%, #3a0a0a 90%, #1a0505 100%)",
          boxShadow: curtainOpen ? "none" : "-8px 0 40px rgba(0,0,0,0.8)",
          pointerEvents: curtainOpen ? "none" : "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 28px, rgba(0,0,0,0.25) 28px, rgba(0,0,0,0.25) 30px, transparent 30px, transparent 60px, rgba(255,200,50,0.03) 60px, rgba(255,200,50,0.03) 61px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, oklch(75 0.18 50) 20%, oklch(65 0.22 50) 50%, oklch(75 0.18 50) 80%, transparent)",
            boxShadow:
              "0 0 12px oklch(75 0.18 50 / 0.6), 0 0 24px oklch(75 0.18 50 / 0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background:
              "linear-gradient(to bottom, oklch(75 0.18 50 / 0.8), transparent)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          type="button"
          data-ocid="events.button"
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
            Events
          </span>
          <div
            className="h-px w-6"
            style={{ background: "oklch(75 0.18 50 / 0.4)" }}
          />
        </div>

        {!isAdmin ? (
          <button
            type="button"
            data-ocid="events.open_modal_button"
            onClick={() => {
              setShowPinInput((v) => !v);
              setPinError("");
              setPin("");
            }}
            className="font-cinzel text-xs tracking-[0.25em] uppercase px-3 py-1 transition-all hover:opacity-80"
            style={{
              color: "oklch(75 0.18 50)",
              border: "1px solid oklch(75 0.18 50 / 0.4)",
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
            }}
          >
            [ Exit Admin ]
          </button>
        )}
      </header>

      {/* PIN input */}
      {showPinInput && (
        <div
          className="relative z-20 mx-6 mb-2 p-4 flex flex-col gap-3"
          style={{
            border: "1px solid oklch(75 0.18 50 / 0.3)",
            background: "oklch(10 0.03 50 / 0.9)",
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
              id="events-pin-input"
              type="password"
              data-ocid="events.input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="PIN"
              className="flex-1 bg-transparent font-cinzel text-sm tracking-[0.3em] text-center outline-none px-3 py-2"
              style={{
                color: "oklch(75 0.18 50)",
                border: "1px solid oklch(75 0.18 50 / 0.4)",
              }}
            />
            <button
              type="button"
              data-ocid="events.confirm_button"
              onClick={handlePinSubmit}
              className="font-cinzel text-xs tracking-[0.2em] uppercase px-4 py-2 transition-all hover:opacity-80"
              style={{ color: "#000", background: "oklch(75 0.18 50)" }}
            >
              Enter
            </button>
          </div>
          {pinError && (
            <p
              data-ocid="events.error_state"
              className="font-raleway text-xs text-center"
              style={{ color: "oklch(60 0.22 25)" }}
            >
              {pinError}
            </p>
          )}
        </div>
      )}

      {/* Admin add button */}
      {isAdmin && (
        <div className="relative z-10 flex justify-center mb-2 px-6">
          <button
            type="button"
            data-ocid="events.primary_button"
            onClick={openAddForm}
            className="flex items-center gap-2 font-cinzel text-sm tracking-[0.25em] uppercase px-6 py-2 transition-all hover:opacity-80"
            style={{ color: "#000", background: "oklch(75 0.18 50)" }}
          >
            <ImagePlus size={14} />
            Add Event
          </button>
        </div>
      )}

      {/* Carousel */}
      <main className="relative z-10">
        <div
          className="relative overflow-hidden"
          style={{ height: "55vh", minHeight: "300px" }}
        >
          {currentEvent && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${currentEvent.backgroundImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isTransitioning ? 0 : 1,
                transition: "opacity 0.4s ease",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.85) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
              pointerEvents: "none",
              opacity: 0.5,
            }}
          />

          {/* Text overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              opacity: isTransitioning ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            <p
              className="font-cinzel"
              style={{
                fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "oklch(75 0.18 50)",
                textShadow: "0 0 20px oklch(75 0.18 50 / 0.6)",
              }}
            >
              Hybe Presents
            </p>
            <h1
              className="font-cinzel font-black"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#fff",
                textShadow:
                  "0 0 30px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.8)",
                lineHeight: 1,
                textAlign: "center",
                padding: "0 1rem",
              }}
            >
              {currentEvent?.title}
            </h1>
            <div
              style={{
                padding: "0.35rem 1.2rem",
                border: "1px solid oklch(75 0.18 50 / 0.7)",
                background: "oklch(75 0.18 50 / 0.08)",
              }}
            >
              <p
                className="font-raleway"
                style={{
                  fontSize: "clamp(0.6rem, 1.4vw, 0.85rem)",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "oklch(75 0.18 50)",
                }}
              >
                {currentEvent?.status}
              </p>
            </div>
          </div>

          {/* Admin controls on slide */}
          {isAdmin && currentEvent && (
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
                data-ocid={`events.edit_button.${currentIndex + 1}`}
                onClick={() => openEditForm(currentEvent)}
                className="p-2 transition-all hover:opacity-80"
                style={{
                  background: "oklch(75 0.18 50 / 0.15)",
                  border: "1px solid oklch(75 0.18 50 / 0.5)",
                  color: "oklch(75 0.18 50)",
                }}
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                data-ocid={`events.delete_button.${currentIndex + 1}`}
                onClick={() => handleDelete(currentEvent.id)}
                className="p-2 transition-all hover:opacity-80"
                style={{
                  background: "oklch(30 0.15 25 / 0.3)",
                  border: "1px solid oklch(60 0.2 25 / 0.5)",
                  color: "oklch(70 0.18 25)",
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}

          {/* Dot indicators */}
          {events.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                zIndex: 10,
              }}
            >
              {events.map((ev, i) => (
                <button
                  type="button"
                  key={ev.id}
                  data-ocid={`events.toggle.${i + 1}`}
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
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {currentEvent?.description && (
          <div
            style={{
              padding: "2rem 1.5rem",
              borderTop: "1px solid oklch(75 0.18 50 / 0.2)",
              background:
                "linear-gradient(to bottom, oklch(5 0.03 50 / 0.8), #000)",
              opacity: isTransitioning ? 0 : 1,
              transition: "opacity 0.4s ease",
            }}
          >
            <div className="max-w-lg mx-auto text-center">
              <div
                className="h-px mx-auto mb-4"
                style={{ width: "3rem", background: "oklch(75 0.18 50 / 0.5)" }}
              />
              <p
                className="font-raleway"
                style={{
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  lineHeight: 1.9,
                  letterSpacing: "0.05em",
                  color: "oklch(85 0.04 50 / 0.8)",
                  fontStyle: "italic",
                }}
              >
                {currentEvent.description}
              </p>
              <div
                className="h-px mx-auto mt-4"
                style={{ width: "3rem", background: "oklch(75 0.18 50 / 0.5)" }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          data-ocid="events.modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
        >
          <div
            className="w-full max-w-md p-6 flex flex-col gap-4 overflow-y-auto"
            style={{
              background: "#0a0a0a",
              border: "1px solid oklch(75 0.18 50 / 0.5)",
              maxHeight: "90vh",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2
                className="font-cinzel text-sm tracking-[0.3em] uppercase"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                {editingId ? "Edit Event" : "New Event"}
              </h2>
              <button
                type="button"
                data-ocid="events.close_button"
                onClick={() => setShowForm(false)}
                className="transition-opacity hover:opacity-60"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Image upload */}
            <div>
              <label
                htmlFor="events-bg-img"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Background Image
              </label>
              <label
                htmlFor="events-bg-img"
                data-ocid="events.dropzone"
                className="relative flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                style={{
                  border: "1px dashed oklch(75 0.18 50 / 0.4)",
                  minHeight: "90px",
                  background: "oklch(75 0.18 50 / 0.03)",
                  display: "flex",
                }}
              >
                {formImage ? (
                  <img
                    src={formImage}
                    alt="preview"
                    className="w-full max-h-36 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <ImagePlus
                      size={18}
                      style={{ color: "oklch(75 0.18 50 / 0.5)" }}
                    />
                    <span
                      className="font-raleway text-xs tracking-wider"
                      style={{ color: "oklch(75 0.18 50 / 0.4)" }}
                    >
                      Click to upload image
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="events-bg-img"
                  type="file"
                  data-ocid="events.upload_button"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="events-form-title"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Event Title
              </label>
              <input
                id="events-form-title"
                type="text"
                data-ocid="events.input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Event name"
                className="w-full bg-transparent font-raleway text-sm px-3 py-2 outline-none"
                style={{
                  color: "oklch(90 0.05 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                }}
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="events-form-status"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Status
              </label>
              <input
                id="events-form-status"
                type="text"
                data-ocid="events.input"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                placeholder="e.g. coming soon, live, ended"
                className="w-full bg-transparent font-raleway text-sm px-3 py-2 outline-none"
                style={{
                  color: "oklch(90 0.05 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="events-form-desc"
                className="font-cinzel text-xs tracking-[0.25em] uppercase block mb-2"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Description
              </label>
              <textarea
                id="events-form-desc"
                data-ocid="events.textarea"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Cinematic event description..."
                rows={3}
                className="w-full bg-transparent font-raleway text-sm px-3 py-2 outline-none resize-none"
                style={{
                  color: "oklch(90 0.05 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                }}
              />
            </div>

            <div className="flex gap-3 mt-1">
              <button
                type="button"
                data-ocid="events.cancel_button"
                onClick={() => setShowForm(false)}
                className="flex-1 font-cinzel text-xs tracking-[0.2em] uppercase py-3 transition-all hover:opacity-70"
                style={{
                  color: "oklch(75 0.18 50)",
                  border: "1px solid oklch(75 0.18 50 / 0.3)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="events.save_button"
                onClick={handleSave}
                disabled={!formTitle.trim()}
                className="flex-1 font-cinzel text-xs tracking-[0.2em] uppercase py-3 transition-all hover:opacity-80 disabled:opacity-30"
                style={{ color: "#000", background: "oklch(75 0.18 50)" }}
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
