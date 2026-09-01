import { Menu, Palette, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  ["System", "system"],
  ["Work", "work"],
  ["About", "about"],
  ["Game", "game"],
];

export default function Navbar({ theme, onThemeChange }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="site-nav">
      <button className="nav-logo" onClick={() => scrollTo("top")} aria-label="Back to top">
        SK<span>.</span>
      </button>

      <nav className={open ? "nav-links is-open" : "nav-links"}>
        {navItems.map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)}>{label}</button>
        ))}

        <a href="https://www.linkedin.com/in/saeed-saeed-5311a3309" target="_blank" rel="noreferrer">LinkedIn</a>

        <button className="theme-switch" onClick={onThemeChange} aria-label="Change color theme">
          <Palette size={14} />
          <span>{theme}</span>
        </button>
      </nav>

      <button className="mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
