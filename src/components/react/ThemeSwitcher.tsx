import { useEffect, useRef, useState } from "react";

type ThemeId = "coral" | "electric-blue" | "purple-neon" | "emerald-gold" | "charcoal-orange" | "red-bright";

const THEMES: { id: ThemeId; name: string; swatch: string }[] = [
  { id: "coral", name: "Coral", swatch: "linear-gradient(135deg, #ff6b6b, #ff8787)" },
  { id: "electric-blue", name: "Electric Blue", swatch: "linear-gradient(135deg, #2563eb, #3b82f6)" },
  { id: "purple-neon", name: "Purple Neon", swatch: "linear-gradient(135deg, #ff2e9a, #7c3aed)" },
  { id: "emerald-gold", name: "Emerald Gold", swatch: "linear-gradient(135deg, #0f766e, #14b8a6)" },
  { id: "charcoal-orange", name: "Charcoal Orange", swatch: "linear-gradient(135deg, #f97316, #fb923c)" },
  { id: "red-bright", name: "Red Bright", swatch: "linear-gradient(135deg, #e11d48, #f43f5e)" },
];

const STORAGE_KEY = "gm_theme";

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("coral");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && (localStorage.getItem(STORAGE_KEY) as ThemeId)) || null;
    const initial = stored || (document.documentElement.getAttribute("data-theme") as ThemeId) || "coral";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const escHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, []);

  const applyTheme = (id: ThemeId) => {
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const handleSelect = (id: ThemeId) => {
    applyTheme(id);
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="theme-switcher" ref={panelRef}>
      <button
        className="theme-btn"
        aria-label="Cambiar tema de color"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        🎨
      </button>
      {open && (
        <div className="theme-panel" role="menu">
          {THEMES.map((item) => (
            <button
              key={item.id}
              className={`swatch ${item.id === theme ? "active" : ""}`}
              style={{ background: item.swatch }}
              onClick={() => handleSelect(item.id)}
              role="menuitemradio"
              aria-checked={item.id === theme}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(item.id);
                }
              }}
              type="button"
            >
              <span className="swatch__label">{item.name}</span>
            </button>
          ))}
        </div>
      )}
      <style>
        {`
          .theme-switcher {
            position: relative;
          }
          .theme-btn {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: transform 120ms ease, box-shadow 120ms ease, border 120ms ease;
          }
          .theme-btn:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-soft);
            border-color: #cbd5e1;
          }
          .theme-panel {
            position: absolute;
            right: 0;
            margin-top: 8px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 10px;
            box-shadow: var(--shadow-soft);
            display: grid;
            gap: 8px;
            min-width: 210px;
            z-index: 99;
          }
          .swatch {
            width: 100%;
            border: 1px solid transparent;
            border-radius: 12px;
            padding: 10px 12px;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: transform 100ms ease, box-shadow 120ms ease, border 120ms ease;
          }
          .swatch:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-soft);
          }
          .swatch.active {
            border-color: rgba(255,255,255,0.7);
          }
          .swatch__label {
            font-size: 0.95rem;
          }
        `}
      </style>
    </div>
  );
}
