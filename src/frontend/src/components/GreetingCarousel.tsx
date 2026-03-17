import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "hybe_greeting_slides";

interface Slide {
  id: string;
  photo: string;
  heading: string;
  subheading: string;
}

function loadSlides(): Slide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSlides(slides: Slide[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
}

interface GreetingCarouselProps {
  adminUnlocked: boolean;
  onAdminToggle: () => void;
}

export function GreetingCarousel({
  adminUnlocked,
  onAdminToggle,
}: GreetingCarouselProps) {
  const [slides, setSlides] = useState<Slide[]>(loadSlides);
  const [current, setCurrent] = useState(0);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);
  const [editMode, setEditMode] = useState<"add" | "edit" | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formHeading, setFormHeading] = useState("");
  const [formSubheading, setFormSubheading] = useState("");
  const [formPhoto, setFormPhoto] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % slides.length);
      }, 3000);
    }
  }, [slides.length]);

  useEffect(() => {
    startAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAuto]);

  useEffect(() => {
    if (current >= slides.length && slides.length > 0) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const persistSlides = (updated: Slide[]) => {
    setSlides(updated);
    saveSlides(updated);
  };

  const openAdd = () => {
    setEditMode("add");
    setEditIndex(null);
    setFormHeading("");
    setFormSubheading("");
    setFormPhoto("");
    setEditingSlide({});
  };

  const openEdit = (slide: Slide, idx: number) => {
    setEditMode("edit");
    setEditIndex(idx);
    setFormHeading(slide.heading);
    setFormSubheading(slide.subheading);
    setFormPhoto(slide.photo);
    setEditingSlide(slide);
  };

  const handleSave = () => {
    if (!formHeading.trim() || !formPhoto) return;
    if (editMode === "add") {
      const newSlide: Slide = {
        id: Date.now().toString(),
        photo: formPhoto,
        heading: formHeading,
        subheading: formSubheading,
      };
      persistSlides([...slides, newSlide]);
    } else if (editMode === "edit" && editIndex !== null) {
      const updated = slides.map((s, i) =>
        i === editIndex
          ? {
              ...s,
              photo: formPhoto,
              heading: formHeading,
              subheading: formSubheading,
            }
          : s,
      );
      persistSlides(updated);
    }
    setEditingSlide(null);
    setEditMode(null);
  };

  const handleDelete = (idx: number) => {
    const updated = slides.filter((_, i) => i !== idx);
    persistSlides(updated);
    if (current >= updated.length) setCurrent(Math.max(0, updated.length - 1));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const fieldLabelStyle = {
    fontFamily: "inherit",
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "oklch(75 0.18 50 / 0.7)",
  };

  const formOverlay =
    editingSlide !== null
      ? createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              zIndex: 9999,
            }}
          >
            <div
              className="w-full max-w-sm flex flex-col gap-4 p-6"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid oklch(75 0.18 50 / 0.35)",
                borderRadius: "18px",
                boxShadow: "0 0 50px oklch(75 0.18 50 / 0.12)",
              }}
            >
              <h3
                className="font-cinzel text-center tracking-widest uppercase text-sm"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                {editMode === "add" ? "Add Slide" : "Edit Slide"}
              </h3>

              <div className="flex flex-col gap-2">
                <span className="font-raleway" style={fieldLabelStyle}>
                  Photo
                </span>
                {formPhoto && (
                  <img
                    src={formPhoto}
                    alt=""
                    className="w-full h-28 object-cover"
                    style={{
                      borderRadius: "10px",
                      border: "1px solid oklch(75 0.18 50 / 0.3)",
                    }}
                  />
                )}
                <button
                  type="button"
                  data-ocid="greeting.slide_photo_upload"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-raleway text-xs tracking-widest text-center py-2 transition-opacity hover:opacity-70"
                  style={{
                    background: "oklch(75 0.18 50 / 0.08)",
                    border: "1px dashed oklch(75 0.18 50 / 0.4)",
                    borderRadius: "8px",
                    color: "oklch(75 0.18 50)",
                    cursor: "pointer",
                  }}
                >
                  {formPhoto ? "Change Photo" : "Upload Photo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="gc-heading"
                  className="font-raleway"
                  style={fieldLabelStyle}
                >
                  Heading
                </label>
                <Input
                  id="gc-heading"
                  value={formHeading}
                  onChange={(e) => setFormHeading(e.target.value)}
                  placeholder="e.g. Happy Diwali!"
                  data-ocid="greeting.slide_heading_input"
                  className="font-cinzel text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid oklch(75 0.18 50 / 0.3)",
                    borderRadius: "10px",
                    color: "oklch(75 0.18 50)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="gc-subheading"
                  className="font-raleway"
                  style={fieldLabelStyle}
                >
                  Subheading
                </label>
                <Input
                  id="gc-subheading"
                  value={formSubheading}
                  onChange={(e) => setFormSubheading(e.target.value)}
                  placeholder="e.g. From HYBE Music with love"
                  data-ocid="greeting.slide_subheading_input"
                  className="font-raleway text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid oklch(75 0.18 50 / 0.3)",
                    borderRadius: "10px",
                    color: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>

              <div className="flex gap-3 pt-1">
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
                    setEditingSlide(null);
                    setEditMode(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="greeting.save_slide_button"
                  className="flex-1 font-cinzel text-xs tracking-widest"
                  style={{
                    background: "oklch(75 0.18 50 / 0.18)",
                    border: "1px solid oklch(75 0.18 50 / 0.55)",
                    color: "oklch(75 0.18 50)",
                    borderRadius: "10px",
                  }}
                  disabled={!formHeading.trim() || !formPhoto}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative z-10 w-full" data-ocid="greeting.carousel_section">
      {/* Carousel viewer — only when slides exist */}
      {slides.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "clamp(180px, 32vw, 280px)",
            borderRadius: "0 0 18px 18px",
            boxShadow: "0 8px 40px oklch(75 0.18 50 / 0.08)",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === current ? 1 : 0,
                pointerEvents: i === current ? "auto" : "none",
              }}
            >
              <img
                src={slide.photo}
                alt={slide.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 px-6 pb-5 pr-16">
                <h3
                  className="font-cinzel font-bold tracking-[0.12em] uppercase mb-1"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                    color: "oklch(75 0.18 50)",
                    textShadow: "0 0 20px oklch(75 0.18 50 / 0.5)",
                  }}
                >
                  {slide.heading}
                </h3>
                {slide.subheading && (
                  <p
                    className="font-raleway text-sm tracking-wide"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 0 12px rgba(255,255,255,0.3)",
                    }}
                  >
                    {slide.subheading}
                  </p>
                )}
              </div>
            </div>
          ))}

          {slides.length > 1 && (
            <div className="absolute bottom-3 right-0 left-0 flex justify-center gap-1.5 pointer-events-none">
              {slides.map((slide, i) => (
                <button
                  type="button"
                  key={slide.id}
                  className="pointer-events-auto transition-all duration-300"
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? "18px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background:
                      i === current
                        ? "oklch(75 0.18 50)"
                        : "rgba(255,255,255,0.35)",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Panel — shown when unlocked, always above panels */}
      {adminUnlocked && (
        <div
          className="mx-4 mt-3 mb-2 p-4 flex flex-col gap-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            border: "1px solid oklch(75 0.18 50 / 0.3)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px oklch(75 0.18 50 / 0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-cinzel text-xs tracking-[0.3em] uppercase"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              Greetings Admin
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="greeting.add_slide_button"
                onClick={openAdd}
                className="font-raleway text-xs tracking-widest flex items-center gap-1 transition-opacity hover:opacity-80"
                style={{
                  background: "oklch(75 0.18 50 / 0.12)",
                  border: "1px solid oklch(75 0.18 50 / 0.4)",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  color: "oklch(75 0.18 50)",
                  cursor: "pointer",
                }}
              >
                + Add Slide
              </button>
              <button
                type="button"
                onClick={onAdminToggle}
                className="font-raleway text-xs tracking-widest transition-opacity hover:opacity-80"
                style={{
                  background: "oklch(40 0.15 25 / 0.2)",
                  border: "1px solid oklch(50 0.2 25 / 0.4)",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  color: "oklch(70 0.15 25)",
                  cursor: "pointer",
                }}
              >
                Exit
              </button>
            </div>
          </div>

          {slides.length === 0 && (
            <p
              className="font-raleway text-xs text-center py-3 opacity-50"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              No slides yet. Add one above.
            </p>
          )}

          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              data-ocid={`greeting.slide.item.${idx + 1}`}
              className="flex items-center gap-3 p-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid oklch(75 0.18 50 / 0.2)",
                borderRadius: "12px",
              }}
            >
              {slide.photo && (
                <img
                  src={slide.photo}
                  alt=""
                  className="w-12 h-12 object-cover shrink-0"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid oklch(75 0.18 50 / 0.3)",
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-cinzel text-xs font-bold truncate"
                  style={{ color: "oklch(75 0.18 50)" }}
                >
                  {slide.heading}
                </p>
                <p
                  className="font-raleway text-xs truncate opacity-60"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {slide.subheading}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  data-ocid={`greeting.slide.edit_button.${idx + 1}`}
                  onClick={() => openEdit(slide, idx)}
                  className="font-raleway text-xs transition-opacity hover:opacity-70"
                  style={{
                    background: "oklch(75 0.18 50 / 0.1)",
                    border: "1px solid oklch(75 0.18 50 / 0.3)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    color: "oklch(75 0.18 50)",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  data-ocid={`greeting.delete_slide_button.${idx + 1}`}
                  onClick={() => handleDelete(idx)}
                  className="font-raleway text-xs transition-opacity hover:opacity-70"
                  style={{
                    background: "oklch(40 0.15 25 / 0.2)",
                    border: "1px solid oklch(50 0.2 25 / 0.4)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    color: "oklch(70 0.15 25)",
                    cursor: "pointer",
                  }}
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Form Overlay — rendered via portal to escape stacking contexts */}
      {formOverlay}
    </div>
  );
}
