import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);
const preference = window.matchMedia("(prefers-color-scheme: dark)");
const readPalette = () => {
  const style = getComputedStyle(document.documentElement);
  const value = (token) => style.getPropertyValue(token).trim();
  return {
    background: value("--color-hero-background"),
    ascii: [value("--ascii-blue"), value("--ascii-red"), value("--ascii-highlight")],
    books: Array.from({ length: 5 }, (_, index) => value(`--book-${index + 1}`)),
    foil: value("--book-foil"),
  };
};

export function ThemeProvider({ children }) {
  const [theme, updateTheme] = useState(document.documentElement.dataset.theme || "classic");
  const [palette, updatePalette] = useState(readPalette);
  const [manual, setManual] = useState(() => {
    try { return ["classic", "symbiote"].includes(localStorage.getItem("portfolio-suit")); }
    catch { return false; }
  });
  const [switching, setSwitching] = useState(false);

  const apply = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "classic" ? "#f7f8fc" : "#080a0f");
    updateTheme(next);
    updatePalette(readPalette());
  }, []);

  useEffect(() => {
    const change = () => { if (!manual) apply(preference.matches ? "symbiote" : "classic"); };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, [manual, apply]);

  const setTheme = useCallback(async (next, event) => {
    if (next === theme || switching) return;
    setManual(true);
    try { localStorage.setItem("portfolio-suit", next); } catch { /* Private browsing remains usable. */ }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) { apply(next); return; }
    const rect = event?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const circle = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
    setSwitching(true);
    document.documentElement.dataset.reveal = next;
    try {
      const transition = document.startViewTransition(() => flushSync(() => apply(next)));
      await transition.ready;
      document.documentElement.animate(
        { clipPath: next === "classic" ? [...circle].reverse() : circle },
        { duration: 560, easing: "cubic-bezier(.22,1,.36,1)", fill: "both", pseudoElement: next === "classic" ? "::view-transition-old(root)" : "::view-transition-new(root)" },
      );
      await transition.finished;
    } catch { apply(next); }
    finally { setSwitching(false); }
  }, [theme, switching, apply]);

  const context = useMemo(() => ({ theme, palette, setTheme, switching }), [theme, palette, setTheme, switching]);
  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
