import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatedBackground } from "./motion/primitives";
import MotionDock from "./ui/MotionDock";
import SuitSwitcher from "./ui/SuitSwitcher";

const navItems = [["system", "system"], ["work", "work"], ["about", "about"]];
const languages = ["EN", "DE", "AR", "SK"];

export default function Navbar({ language, onLanguageChange, t }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const toggleRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape" && open) { setOpen(false); toggleRef.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setOpen(false);
  };
  return <header className="site-nav">
    <button className="nav-logo" onClick={() => scrollTo("top")} aria-label="Back to top">SK<span>.</span></button>
    <MotionDock t={t} active={active} scrollTo={scrollTo} />
    <div className="nav-controls">
      <div className="language-picker" role="group" aria-label={t.nav.language}>
        <AnimatedBackground value={language}>
          {languages.map((code) => <button key={code} data-id={code} className={code === language ? "language-option is-active" : "language-option"} onClick={() => onLanguageChange(code)} aria-pressed={code === language}>{code}</button>)}
        </AnimatedBackground>
      </div>
      <select className="mobile-language" aria-label={t.nav.language} value={language} onChange={(event) => onLanguageChange(event.target.value)}>{languages.map((code) => <option key={code} value={code}>{code}</option>)}</select>
      <SuitSwitcher language={language} />
      <button ref={toggleRef} className="mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
    <nav id="mobile-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
      {navItems.map(([key, id]) => <button key={id} onClick={() => scrollTo(id)} aria-current={active === id ? "location" : undefined}>{t.nav[key]}</button>)}
      <a href="https://www.linkedin.com/in/saeid-kabak-5311a3309" target="_blank" rel="noreferrer">{t.nav.linkedin}</a>
    </nav>
  </header>;
}
