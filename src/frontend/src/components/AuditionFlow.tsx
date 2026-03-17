import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Step = "rules" | "vacancy" | "form" | "confirmation";

interface VacancyItem {
  id: string;
  group: string;
  member: string;
  taken: boolean;
}

interface Vacancy {
  id: string;
  title: string;
  description: string;
  vacancyId?: string;
}

interface Response {
  id: string;
  vacancyTitle: string;
  roleplayName: string;
  dob: string;
  faceClaim: string;
  contactNumber: string;
  membershipStatus: string;
  submittedAt: string;
}

const DEFAULT_VACANCY_GROUPS = [
  { group: "TXT", members: ["Taehyun", "Hyuka", "Soobin"] },
  { group: "LE SSERAFIM", members: ["Sakura", "Kazuha", "Eunchae"] },
  {
    group: "STRAYKIDS",
    members: [
      "Bang Chan",
      "Lee Know",
      "Changbin",
      "Han",
      "Felix",
      "Seungmin",
      "Jeongin",
    ],
  },
  { group: "ENHYPEN", members: ["Jungwon", "Sunoo"] },
  { group: "ITZY", members: ["Yeji", "Lia", "Chaeryeong", "Yuna"] },
  {
    group: "SEVENTEEN",
    members: [
      "Jeonghan",
      "Joshua",
      "Jun",
      "Hoshi",
      "Wonwoo",
      "Woozi",
      "Mingyu",
      "The8",
      "Seungkwan",
      "Vernon",
      "Dino",
    ],
  },
  {
    group: "TWICE",
    members: [
      "Nayeon",
      "Jeongyeon",
      "Sana",
      "Jihyo",
      "Mina",
      "Dahyun",
      "Chaeyoung",
      "Tzuyu",
    ],
  },
  {
    group: "KATSEYE",
    members: ["Sophia", "Lara", "Megan", "Daniela", "Manon"],
  },
  { group: "CORTIS", members: ["Keonho", "Martin", "James"] },
  {
    group: "ATEEZ",
    members: ["Seonghwa", "Yunho", "Yeosang", "Hongjoong", "Jongho"],
  },
  {
    group: "BABYMONSTER",
    members: ["Ruka", "Pharita", "Ahyeon", "Rami", "Rora"],
  },
  {
    group: "NMIXX",
    members: ["Lily", "Haewon", "Sullyoon", "Jiwoo", "Kyujin"],
  },
];

function initVacancies(): VacancyItem[] {
  try {
    const raw = localStorage.getItem("hybe_vacancies_v2");
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaults: VacancyItem[] = DEFAULT_VACANCY_GROUPS.flatMap(
    ({ group, members }) =>
      members.map((member) => ({
        id: `${group}-${member}`.toLowerCase().replace(/\s+/g, "-"),
        group,
        member,
        taken: false,
      })),
  );
  localStorage.setItem("hybe_vacancies_v2", JSON.stringify(defaults));
  return defaults;
}

function saveVacancyItems(items: VacancyItem[]) {
  localStorage.setItem("hybe_vacancies_v2", JSON.stringify(items));
}

function markVacancyTaken(vacancyId: string) {
  const items = initVacancies();
  const updated = items.map((v) =>
    v.id === vacancyId ? { ...v, taken: true } : v,
  );
  saveVacancyItems(updated);
}

function getResponses(): Response[] {
  try {
    const raw = localStorage.getItem("hybe_responses");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResponse(response: Response) {
  const existing = getResponses();
  existing.push(response);
  localStorage.setItem("hybe_responses", JSON.stringify(existing));
}

// ─── Atmospheric Background ─────────────────────────────────────────────────
function AtmoBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
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
  );
}

// ─── Gold Button ─────────────────────────────────────────────────────────────
function GoldButton({
  children,
  onClick,
  ocid,
  type = "button",
  disabled,
  small,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ocid?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  small?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type={type}
      data-ocid={ocid}
      onClick={onClick}
      disabled={disabled}
      className={`font-cinzel tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-40 ${small ? "text-xs px-4 py-1.5" : "text-sm px-8 py-3"}`}
      style={{
        background: "#000",
        border: danger
          ? "1px solid oklch(55 0.22 25 / 0.7)"
          : "1px solid oklch(75 0.18 50 / 0.7)",
        color: danger ? "oklch(65 0.22 25)" : "oklch(75 0.18 50)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.boxShadow = danger
            ? "0 0 20px oklch(55 0.22 25 / 0.4), 0 0 40px oklch(55 0.22 25 / 0.15)"
            : "0 0 20px oklch(75 0.18 50 / 0.4), 0 0 40px oklch(75 0.18 50 / 0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

// ─── Step 1: Rules Overlay ────────────────────────────────────────────────────
function RulesOverlay({ onNext }: { onNext: () => void }) {
  const rules = [
    {
      num: "001",
      text: (
        <span>
          Until the opening ceremony takes place, Members are not allowed to
          disclose their roles / identity in front of{" "}
          <strong style={{ color: "oklch(75 0.18 50)" }}>anyone</strong>. Not
          even their friends.
        </span>
      ),
    },
    {
      num: "002",
      text: (
        <span>
          You can not disclose your element to the other person and give them
          even the slightest hint of the bands within the element to maintain
          the secrecy and the concept of the group.
        </span>
      ),
    },
    {
      num: "003",
      text: (
        <span>
          Choose your face claim wisely, after joining the group you're only
          allowed to change your face claim once, that too after the opening.
        </span>
      ),
    },
    {
      num: "004",
      text: (
        <span>The events in the opening ceremony will be shared soon.</span>
      ),
    },
    {
      num: "005",
      text: (
        <span>
          Copying any event / theme / concept in name of <em>"inspiration"</em>{" "}
          is entirely prohibited. If caught, a copyright would be given right
          away.
        </span>
      ),
    },
    {
      num: "006",
      text: (
        <span>
          The group is highly activity based. Active participation is{" "}
          <strong style={{ color: "oklch(75 0.18 50)" }}>mandatory</strong>. No
          excuses will be entertained.
        </span>
      ),
    },
    {
      num: "007",
      text: (
        <span>
          After joining the waiting/reservation area.{" "}
          <strong style={{ color: "oklch(75 0.18 50)" }}>DO NOT</strong> add
          your role in the{" "}
          <strong style={{ color: "oklch(75 0.18 50)" }}>
            &quot;members tag&quot;
          </strong>{" "}
          until opening. You can add your roleplay name if you want.
        </span>
      ),
    },
  ];

  return (
    <div
      data-ocid="audition.rules_overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
        style={{
          border: "1px solid oklch(75 0.18 50 / 0.6)",
          background: "#000",
        }}
      >
        {[
          "top-0 left-0",
          "top-0 right-0",
          "bottom-0 left-0",
          "bottom-0 right-0",
        ].map((pos, i) => (
          <div
            key={pos}
            className={`absolute ${pos} w-4 h-4 pointer-events-none`}
            style={{
              border: "2px solid oklch(75 0.18 50)",
              clipPath:
                i === 0
                  ? "polygon(0 0,100% 0,0 100%)"
                  : i === 1
                    ? "polygon(0 0,100% 0,100% 100%)"
                    : i === 2
                      ? "polygon(0 0,0 100%,100% 100%)"
                      : "polygon(100% 0,0 100%,100% 100%)",
            }}
          />
        ))}

        <div className="overflow-y-auto flex-1 px-6 pt-8 pb-4">
          <div className="text-center mb-6">
            <p
              className="font-cinzel text-xl font-bold tracking-[0.3em] mb-3"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              ‼️ I M P O R T A N T ‼️
            </p>
            <div className="h-px w-24 mx-auto gold-shimmer mb-4" />
            <p
              className="font-raleway text-sm leading-relaxed opacity-80 italic"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              <em>Note</em> : The below mentioned rules must not be violated. In
              case of violation, you may get strikes or a direct removal based
              on the weight of your mistake.
            </p>
          </div>

          <div
            className="text-center mb-6 tracking-[1em] opacity-40"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            . . . . .
          </div>

          <ol className="space-y-5">
            {rules.map((rule) => (
              <li key={rule.num} className="flex gap-4 items-start">
                <span
                  className="shrink-0 font-mono text-xs px-2 py-1"
                  style={{
                    border: "1px solid oklch(75 0.18 50 / 0.4)",
                    color: "oklch(75 0.18 50)",
                    background: "oklch(75 0.18 50 / 0.06)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {rule.num}
                </span>
                <p
                  className="font-raleway text-sm leading-relaxed opacity-85"
                  style={{ color: "oklch(85 0.05 50)" }}
                >
                  {rule.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="h-px w-24 mx-auto gold-shimmer mt-8" />
        </div>

        <div
          className="px-6 py-5 text-center border-t"
          style={{ borderColor: "oklch(75 0.18 50 / 0.2)" }}
        >
          <GoldButton onClick={onNext} ocid="audition.rules_next_button">
            [ Next ]
          </GoldButton>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Vacancy Panel ────────────────────────────────────────────────────
function VacancyPanel({
  onBack,
  onSelectVacancy,
}: { onBack: () => void; onSelectVacancy: (v: Vacancy) => void }) {
  const [vacancyItems, setVacancyItems] =
    useState<VacancyItem[]>(initVacancies);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  // Admin custom vacancy
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  // Optional desired role
  const [desiredName, setDesiredName] = useState("");
  const [desiredCategory, setDesiredCategory] = useState("");
  const [desiredBandName, setDesiredBandName] = useState("");

  const availableItems = vacancyItems.filter((v) => !v.taken);
  const takenItems = vacancyItems.filter((v) => v.taken);

  // Group available items by group
  const groupedAvailable: Record<string, VacancyItem[]> = {};
  for (const item of availableItems) {
    if (!groupedAvailable[item.group]) groupedAvailable[item.group] = [];
    groupedAvailable[item.group].push(item);
  }

  // Check if desired name is already taken in responses
  const allResponses = getResponses();
  const desiredNameTaken =
    desiredName.trim().length > 0 &&
    allResponses.some(
      (r) => r.vacancyTitle.toLowerCase() === desiredName.trim().toLowerCase(),
    );

  function submitPin() {
    if (pin === "hybe2024") {
      setIsAdmin(true);
      setShowPinModal(false);
      setPin("");
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Try again.");
    }
  }

  function restoreVacancy(id: string) {
    const updated = vacancyItems.map((v) =>
      v.id === id ? { ...v, taken: false } : v,
    );
    setVacancyItems(updated);
    saveVacancyItems(updated);
  }

  function removeAvailableVacancy(id: string) {
    // Mark as taken (remove from available) via admin action
    const updated = vacancyItems.map((v) =>
      v.id === id ? { ...v, taken: true } : v,
    );
    setVacancyItems(updated);
    saveVacancyItems(updated);
  }

  function addCustomVacancy() {
    if (!newTitle.trim()) return;
    // Add as a custom VacancyItem
    const newItem: VacancyItem = {
      id: `custom-${Date.now()}`,
      group: "Custom",
      member: newTitle.trim(),
      taken: false,
    };
    const updated = [...vacancyItems, newItem];
    setVacancyItems(updated);
    saveVacancyItems(updated);
    setNewTitle("");
    setNewDesc("");
  }

  function openResponses() {
    setResponses(getResponses());
    setShowResponses(true);
  }

  function deleteResponse(responseId: string) {
    // Find the response to get the vacancyTitle
    const allResp = getResponses();
    const target = allResp.find((r) => r.id === responseId);

    // Remove response from localStorage
    const updated = allResp.filter((r) => r.id !== responseId);
    localStorage.setItem("hybe_responses", JSON.stringify(updated));

    // Restore vacancy if we can find a match
    if (target) {
      const titleLower = target.vacancyTitle.toLowerCase();
      const matchedItem = vacancyItems.find((item) => {
        const itemTitle = `${item.group} · ${item.member}`.toLowerCase();
        return itemTitle === titleLower;
      });
      if (matchedItem) {
        const updatedVacancies = vacancyItems.map((v) =>
          v.id === matchedItem.id ? { ...v, taken: false } : v,
        );
        setVacancyItems(updatedVacancies);
        saveVacancyItems(updatedVacancies);
      }
    }

    // Update responses state
    setResponses(updated);
  }

  function proceedWithDesiredRole() {
    if (!desiredName.trim() || !desiredCategory) return;
    if (desiredCategory === "Band / Name" && !desiredBandName.trim()) return;
    const title =
      desiredCategory === "Band / Name" && desiredBandName.trim()
        ? `${desiredBandName.trim()} · ${desiredName.trim()}`
        : desiredName.trim();
    onSelectVacancy({
      id: `custom-${Date.now()}`,
      title,
      description: desiredCategory,
    });
  }

  const goldInput =
    "bg-black font-raleway text-sm border outline-none focus:ring-1 px-3 py-2 w-full";
  const goldInputStyle = {
    borderColor: "oklch(75 0.18 50 / 0.4)",
    color: "oklch(85 0.05 50)",
    background: "#000",
    caretColor: "oklch(75 0.18 50)",
  };

  const groupOrder = DEFAULT_VACANCY_GROUPS.map((g) => g.group);
  const sortedGroups = Object.keys(groupedAvailable).sort((a, b) => {
    const ai = groupOrder.indexOf(a);
    const bi = groupOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div
      data-ocid="audition.vacancy_panel"
      className="min-h-screen w-full relative"
      style={{ background: "#000" }}
    >
      <AtmoBg />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="font-raleway text-xs tracking-widest uppercase mb-8 opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          ‹ Back
        </button>
        {/* Admin button row - completely above the title */}
        {!isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              data-ocid="audition.admin_button"
              onClick={() => setShowPinModal(true)}
              className="font-cinzel text-xs tracking-[0.3em] uppercase opacity-20 hover:opacity-60 transition-opacity"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              [ Admin ]
            </button>
          </div>
        )}
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="font-cinzel font-bold tracking-[0.4em] uppercase text-3xl"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            VACANCIES
          </h1>
          <p
            className="font-cinzel text-xs tracking-[0.3em] uppercase mt-2 opacity-50"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Hybe Music
          </p>
          <div className="h-px w-24 mx-auto gold-shimmer mt-4" />
        </div>
        {/* ── USER VIEW ── */}
        {!isAdmin && (
          <>
            {sortedGroups.length === 0 ? (
              <div
                data-ocid="audition.vacancy.empty_state"
                className="text-center py-16"
              >
                <p
                  className="font-raleway text-sm tracking-widest opacity-40"
                  style={{ color: "oklch(75 0.18 50)" }}
                >
                  No vacancies available at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sortedGroups.map((group) => (
                  <div key={group}>
                    {/* Group header */}
                    <div
                      className="pt-5 pb-2"
                      style={{
                        borderTop: "1px solid oklch(75 0.18 50 / 0.15)",
                      }}
                    >
                      <p
                        className="font-cinzel text-xs font-bold tracking-[0.35em] uppercase"
                        style={{ color: "oklch(75 0.18 50)" }}
                      >
                        {group}
                      </p>
                    </div>
                    {/* Member rows */}
                    {groupedAvailable[group].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2.5 group transition-all duration-200"
                        style={{ background: "transparent" }}
                        onClick={() =>
                          onSelectVacancy({
                            id: Date.now().toString(),
                            title: `${item.group} · ${item.member}`,
                            description: "",
                            vacancyId: item.id,
                          })
                        }
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "oklch(75 0.18 50 / 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                        }}
                      >
                        <span
                          className="font-raleway text-sm tracking-wide"
                          style={{ color: "oklch(80 0.09 50)" }}
                        >
                          {item.member}
                        </span>
                        <span
                          className="opacity-30 group-hover:opacity-80 transition-opacity text-lg"
                          style={{ color: "oklch(75 0.18 50)" }}
                        >
                          ›
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Optional desired role section */}
            <div
              className="mt-10 pt-8"
              style={{ borderTop: "1px dotted oklch(75 0.18 50 / 0.3)" }}
            >
              <p
                className="font-cinzel text-xs tracking-[0.35em] uppercase mb-1"
                style={{ color: "oklch(75 0.18 50 / 0.7)" }}
              >
                Optional
              </p>
              <p
                className="font-raleway text-xs mb-5 opacity-50"
                style={{ color: "oklch(85 0.05 50)" }}
              >
                Can't find your desired role? Enter it below.
              </p>

              <div className="relative mb-4">
                <input
                  data-ocid="audition.desired_role.input"
                  value={desiredName}
                  onChange={(e) => setDesiredName(e.target.value)}
                  placeholder="Enter role name..."
                  className={goldInput}
                  style={goldInputStyle}
                />
                {desiredNameTaken && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-cinzel text-xs tracking-widest uppercase"
                    style={{ color: "oklch(55 0.22 25)" }}
                  >
                    Already Taken
                  </span>
                )}
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Band / Name", "Soloist", "Actor"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setDesiredCategory(cat);
                      if (cat !== "Band / Name") setDesiredBandName("");
                    }}
                    className="font-cinzel text-xs tracking-[0.2em] uppercase px-4 py-2 transition-all duration-200"
                    style={{
                      border:
                        desiredCategory === cat
                          ? "1px solid oklch(75 0.18 50)"
                          : "1px solid oklch(75 0.18 50 / 0.3)",
                      background:
                        desiredCategory === cat
                          ? "oklch(75 0.18 50 / 0.12)"
                          : "transparent",
                      color:
                        desiredCategory === cat
                          ? "oklch(75 0.18 50)"
                          : "oklch(75 0.18 50 / 0.5)",
                      boxShadow:
                        desiredCategory === cat
                          ? "0 0 12px oklch(75 0.18 50 / 0.25)"
                          : "none",
                    }}
                  >
                    [ {cat} ]
                  </button>
                ))}
              </div>

              {/* Band name input when Band / Name is selected */}
              {desiredCategory === "Band / Name" && (
                <div className="relative mb-5">
                  <label
                    htmlFor="desired-band-name"
                    className="font-cinzel text-xs tracking-[0.35em] uppercase mb-1 block"
                    style={{ color: "oklch(75 0.18 50 / 0.7)" }}
                  >
                    Band Name
                  </label>
                  <input
                    id="desired-band-name"
                    data-ocid="audition.desired_band_name.input"
                    value={desiredBandName}
                    onChange={(e) => setDesiredBandName(e.target.value)}
                    placeholder="Enter band name..."
                    className={goldInput}
                    style={goldInputStyle}
                  />
                </div>
              )}

              <GoldButton
                onClick={proceedWithDesiredRole}
                ocid="audition.desired_role.submit_button"
                disabled={
                  !desiredName.trim() ||
                  !desiredCategory ||
                  desiredNameTaken ||
                  (desiredCategory === "Band / Name" && !desiredBandName.trim())
                }
              >
                [ Proceed ]
              </GoldButton>
            </div>
          </>
        )}
        {/* ── ADMIN VIEW ── */}
        {isAdmin && (
          <div className="space-y-8">
            {/* Add Custom Vacancy */}
            <div
              className="p-6"
              style={{
                border: "1px solid oklch(75 0.18 50 / 0.3)",
                background: "oklch(75 0.18 50 / 0.03)",
              }}
            >
              <p
                className="font-cinzel text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                Add Custom Vacancy
              </p>
              <input
                data-ocid="audition.add_vacancy.input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={goldInput}
                style={goldInputStyle}
                placeholder="e.g. Custom Group · Member Name"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className={`${goldInput} mt-2 resize-none`}
                style={goldInputStyle}
                rows={2}
                placeholder="Description (optional)"
              />
              <div className="flex flex-wrap gap-3 mt-4">
                <GoldButton
                  onClick={addCustomVacancy}
                  ocid="audition.add_vacancy.button"
                >
                  + Add
                </GoldButton>
                <GoldButton
                  onClick={openResponses}
                  ocid="audition.view_responses_button"
                >
                  View Responses
                </GoldButton>
                <GoldButton onClick={() => setIsAdmin(false)}>
                  Log Out Admin
                </GoldButton>
              </div>
            </div>
            {/* Active Vacancies */}
            <div>
              <p
                className="font-cinzel text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "oklch(75 0.18 50)" }}
              >
                Active Vacancies
              </p>
              {sortedGroups.length === 0 ? (
                <p
                  className="font-raleway text-xs opacity-40 text-center py-4"
                  style={{ color: "oklch(75 0.18 50)" }}
                >
                  All roles are taken
                </p>
              ) : (
                <div className="space-y-1">
                  {sortedGroups.map((group) => (
                    <div key={group}>
                      <div
                        className="pt-4 pb-2"
                        style={{
                          borderTop: "1px solid oklch(75 0.18 50 / 0.15)",
                        }}
                      >
                        <p
                          className="font-cinzel text-xs font-bold tracking-[0.35em] uppercase"
                          style={{ color: "oklch(75 0.18 50)" }}
                        >
                          {group}
                        </p>
                      </div>
                      {groupedAvailable[group].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-2"
                          style={{
                            borderBottom: "1px solid oklch(75 0.18 50 / 0.06)",
                          }}
                        >
                          <span
                            className="font-raleway text-sm"
                            style={{ color: "oklch(80 0.09 50)" }}
                          >
                            {item.member}
                          </span>
                          <div className="flex gap-2">
                            <GoldButton
                              small
                              onClick={() => removeAvailableVacancy(item.id)}
                            >
                              ✕
                            </GoldButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Taken Roles */}
            <div>
              <p
                className="font-cinzel text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "oklch(75 0.18 50 / 0.6)" }}
              >
                Taken Roles
              </p>
              {takenItems.length === 0 ? (
                <p
                  className="font-raleway text-xs opacity-40 text-center py-4"
                  style={{ color: "oklch(75 0.18 50)" }}
                >
                  No roles taken yet
                </p>
              ) : (
                <div className="space-y-1">
                  {takenItems.map((item, i) => (
                    <div
                      key={item.id}
                      data-ocid={`audition.taken.item.${i + 1}`}
                      className="flex items-center justify-between px-3 py-2"
                      style={{
                        border: "1px solid oklch(75 0.18 50 / 0.15)",
                        background: "oklch(75 0.18 50 / 0.02)",
                      }}
                    >
                      <span
                        className="font-raleway text-sm opacity-60"
                        style={{ color: "oklch(80 0.09 50)" }}
                      >
                        {item.group} · {item.member}
                      </span>
                      <GoldButton
                        small
                        onClick={() => restoreVacancy(item.id)}
                        ocid={`audition.restore_vacancy.button.${i + 1}`}
                      >
                        Restore
                      </GoldButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}{" "}
      </div>

      {/* PIN Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent
          className="max-w-sm"
          style={{
            background: "#000",
            border: "1px solid oklch(75 0.18 50 / 0.5)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-cinzel tracking-[0.2em] uppercase text-center"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              data-ocid="audition.admin_pin_input"
              type="password"
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitPin()}
              className="font-raleway"
              style={{
                background: "#000",
                borderColor: "oklch(75 0.18 50 / 0.4)",
                color: "oklch(85 0.05 50)",
              }}
            />
            {pinError && (
              <p
                className="font-raleway text-xs"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {pinError}
              </p>
            )}
            <GoldButton
              onClick={submitPin}
              ocid="audition.admin_pin_submit_button"
            >
              Enter
            </GoldButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Responses Modal */}
      <Dialog open={showResponses} onOpenChange={setShowResponses}>
        <DialogContent
          data-ocid="audition.responses.dialog"
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          style={{
            background: "#000",
            border: "1px solid oklch(75 0.18 50 / 0.5)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-cinzel tracking-[0.2em] uppercase"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              Submitted Responses
            </DialogTitle>
          </DialogHeader>
          {responses.length === 0 ? (
            <p
              data-ocid="audition.responses.empty_state"
              className="font-raleway text-sm opacity-40 text-center py-8"
              style={{ color: "oklch(75 0.18 50)" }}
            >
              No responses yet.
            </p>
          ) : (
            <div className="space-y-4 mt-2">
              {responses.map((r, i) => (
                <div
                  key={r.id}
                  data-ocid={`audition.responses.item.${i + 1}`}
                  className="relative p-4 pr-16"
                  style={{ border: "1px solid oklch(75 0.18 50 / 0.3)" }}
                >
                  {/* Delete button — top-right corner */}
                  <div className="absolute top-3 right-3">
                    <GoldButton
                      small
                      danger
                      ocid={`audition.delete_response.button.${i + 1}`}
                      onClick={() => deleteResponse(r.id)}
                    >
                      ✕
                    </GoldButton>
                  </div>

                  <p
                    className="font-cinzel text-xs tracking-widest mb-2"
                    style={{ color: "oklch(75 0.18 50)" }}
                  >
                    #{i + 1} — {r.vacancyTitle}
                  </p>
                  <div
                    className="grid grid-cols-2 gap-1 font-raleway text-xs opacity-70"
                    style={{ color: "oklch(85 0.05 50)" }}
                  >
                    <span>Name: {r.roleplayName}</span>
                    <span>DOB: {r.dob}</span>
                    <span>Face Claim: {r.faceClaim}</span>
                    <span>Contact: {r.contactNumber}</span>
                    <span>Status: {r.membershipStatus}</span>
                    <span>
                      Submitted: {new Date(r.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Step 3: Application Form ─────────────────────────────────────────────────
function ApplicationForm({
  vacancy,
  onBack,
  onSubmit,
}: { vacancy: Vacancy; onBack: () => void; onSubmit: () => void }) {
  const [roleplayName, setRoleplayName] = useState("");
  const [dob, setDob] = useState("");
  const [faceClaim, setFaceClaim] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!roleplayName.trim()) e.roleplayName = "Required";
    if (!dob) e.dob = "Required";
    if (!faceClaim.trim()) e.faceClaim = "Required";
    if (!contactNumber.trim()) e.contactNumber = "Required";
    if (!membershipStatus) e.membershipStatus = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const response: Response = {
      id: Date.now().toString(),
      vacancyTitle: vacancy.title,
      roleplayName,
      dob,
      faceClaim,
      contactNumber,
      membershipStatus,
      submittedAt: new Date().toISOString(),
    };
    saveResponse(response);
    if (vacancy.vacancyId) {
      markVacancyTaken(vacancy.vacancyId);
    }
    onSubmit();
  }

  const inputStyle = {
    background: "#000",
    borderColor: "oklch(75 0.18 50 / 0.4)",
    color: "oklch(85 0.05 50)",
    caretColor: "oklch(75 0.18 50)",
  };

  return (
    <div
      data-ocid="audition.form_panel"
      className="min-h-screen w-full relative"
      style={{ background: "#000" }}
    >
      <AtmoBg />
      <div className="relative z-10 max-w-xl mx-auto px-6 py-10">
        <button
          type="button"
          onClick={onBack}
          className="font-raleway text-xs tracking-widest uppercase mb-8 opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          ‹ Back
        </button>

        <div className="text-center mb-8">
          <h1
            className="font-cinzel font-bold tracking-[0.3em] uppercase text-2xl"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            {vacancy.title}
          </h1>
          <p
            className="font-raleway text-xs tracking-widest uppercase mt-2 opacity-50"
            style={{ color: "oklch(75 0.18 50)" }}
          >
            Audition Application
          </p>
          <div className="h-px w-24 mx-auto gold-shimmer mt-4" />
        </div>

        <div className="space-y-5">
          <div>
            <Label
              className="font-raleway text-xs tracking-widest uppercase mb-1 block"
              style={{ color: "oklch(75 0.18 50 / 0.7)" }}
            >
              Roleplay Name
            </Label>
            <Input
              data-ocid="audition.roleplay_name.input"
              value={roleplayName}
              onChange={(e) => setRoleplayName(e.target.value)}
              style={inputStyle}
              className="font-raleway"
            />
            {errors.roleplayName && (
              <p
                className="font-raleway text-xs mt-1"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {errors.roleplayName}
              </p>
            )}
          </div>

          <div>
            <Label
              className="font-raleway text-xs tracking-widest uppercase mb-1 block"
              style={{ color: "oklch(75 0.18 50 / 0.7)" }}
            >
              Date of Birth
            </Label>
            <Input
              data-ocid="audition.dob.input"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              className="font-raleway"
            />
            {errors.dob && (
              <p
                className="font-raleway text-xs mt-1"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {errors.dob}
              </p>
            )}
          </div>

          <div>
            <Label
              className="font-raleway text-xs tracking-widest uppercase mb-1 block"
              style={{ color: "oklch(75 0.18 50 / 0.7)" }}
            >
              Face Claim
            </Label>
            <Input
              data-ocid="audition.face_claim.input"
              placeholder="Your face claim"
              value={faceClaim}
              onChange={(e) => setFaceClaim(e.target.value)}
              style={inputStyle}
              className="font-raleway"
            />
            {errors.faceClaim && (
              <p
                className="font-raleway text-xs mt-1"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {errors.faceClaim}
              </p>
            )}
          </div>

          <div>
            <Label
              className="font-raleway text-xs tracking-widest uppercase mb-1 block"
              style={{ color: "oklch(75 0.18 50 / 0.7)" }}
            >
              Contact Number
            </Label>
            <Input
              data-ocid="audition.contact_number.input"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              style={inputStyle}
              className="font-raleway"
            />
            {errors.contactNumber && (
              <p
                className="font-raleway text-xs mt-1"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {errors.contactNumber}
              </p>
            )}
          </div>

          <div>
            <Label
              className="font-raleway text-xs tracking-widest uppercase mb-2 block"
              style={{ color: "oklch(75 0.18 50 / 0.7)" }}
            >
              Membership Status
            </Label>
            <div
              data-ocid="audition.membership_status.select"
              className="flex gap-4"
            >
              {["Old Elysian", "New Elysian"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="membership"
                    value={opt}
                    checked={membershipStatus === opt}
                    onChange={() => setMembershipStatus(opt)}
                    className="accent-yellow-400"
                  />
                  <span
                    className="font-raleway text-sm"
                    style={{ color: "oklch(85 0.05 50)" }}
                  >
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            {errors.membershipStatus && (
              <p
                className="font-raleway text-xs mt-1"
                style={{ color: "oklch(55 0.2 25)" }}
              >
                {errors.membershipStatus}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <GoldButton onClick={handleSubmit} ocid="audition.form_next_button">
            [ Next ]
          </GoldButton>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Confirmation ─────────────────────────────────────────────────────
function ConfirmationPage({ onDone }: { onDone: () => void }) {
  return (
    <div
      data-ocid="audition.confirmation_panel"
      className="min-h-screen w-full relative flex flex-col"
      style={{ background: "#000" }}
    >
      <AtmoBg />
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        <button
          type="button"
          onClick={onDone}
          className="absolute top-8 left-8 font-raleway text-xs tracking-widest uppercase opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: "oklch(75 0.18 50)" }}
        >
          ‹ Home
        </button>

        <div className="h-px w-32 gold-shimmer mb-12" />

        <h1
          className="font-cinzel font-bold tracking-[0.3em] uppercase"
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            color: "oklch(75 0.18 50)",
          }}
        >
          For Confirmation
        </h1>

        <div className="h-px w-24 gold-shimmer my-8" />

        <p
          className="font-raleway text-sm leading-relaxed italic max-w-md opacity-70"
          style={{ color: "oklch(85 0.05 50)" }}
        >
          Visit the creators panel and text one of the creators as
          <br />
          <em>( I have participated into Elysians hunt as / add your role )</em>
        </p>

        <div className="h-px w-32 gold-shimmer mt-10 mb-16" />

        <div className="thank-you-glow">
          <span
            className="font-cinzel font-bold tracking-[0.5em] uppercase"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              color: "oklch(75 0.18 50)",
            }}
          >
            Thank You
          </span>
        </div>
      </div>

      <style>{`
        @keyframes goldGlow {
          0%, 100% { text-shadow: 0 0 20px oklch(75 0.18 50 / 0.6), 0 0 40px oklch(75 0.18 50 / 0.3), 0 0 80px oklch(75 0.18 50 / 0.15); opacity: 0.85; }
          50% { text-shadow: 0 0 30px oklch(75 0.18 50 / 0.9), 0 0 60px oklch(75 0.18 50 / 0.5), 0 0 120px oklch(75 0.18 50 / 0.25); opacity: 1; }
        }
        .thank-you-glow span {
          display: inline-block;
          animation: goldGlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Main AuditionFlow ────────────────────────────────────────────────────────
export function AuditionFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("rules");
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  if (step === "rules") {
    return <RulesOverlay onNext={() => setStep("vacancy")} />;
  }

  if (step === "vacancy") {
    return (
      <VacancyPanel
        onBack={onBack}
        onSelectVacancy={(v) => {
          setSelectedVacancy(v);
          setStep("form");
        }}
      />
    );
  }

  if (step === "form" && selectedVacancy) {
    return (
      <ApplicationForm
        vacancy={selectedVacancy}
        onBack={() => setStep("vacancy")}
        onSubmit={() => setStep("confirmation")}
      />
    );
  }

  if (step === "confirmation") {
    return <ConfirmationPage onDone={onBack} />;
  }

  return null;
}
