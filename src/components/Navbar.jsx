import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  ["system", "system"],
  ["work", "work"],
  ["about", "about"],
  ["game", "game"],
];

const languages = ["EN", "DE", "AR", "SK"];

export default function Navbar({ language, onLanguageChange, t }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const labels = {
    system: t.nav.system,
    work: t.nav.work,
    about: t.nav.about,
    game: t.nav.game,
  };

  return (
    <header className="site-nav">
      <button className="nav-logo" onClick={() => scrollTo("top")} aria-label="Back to top">
        SK<span>.</span>
      </button>

      <nav className={open ? "nav-links is-open" : "nav-links"}>
        {navItems.map(([key, id]) => (
          <button key={id} onClick={() => scrollTo(id)}>{labels[key]}</button>
        ))}
        <a href="www.linkedin.com/in/saeid-kabak-5311a3309" target="_blank" rel="noreferrer">{t.nav.linkedin}</a>

        <div className="language-picker" aria-label={t.nav.language}>
          {languages.map((code) => (
            <button
              key={code}
              className={code === language ? "language-option is-active" : "language-option"}
              onClick={() => onLanguageChange(code)}
              aria-pressed={code === language}
            >
              {code}
            </button>
          ))}
        </div>
      </nav>

      <button className="mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
