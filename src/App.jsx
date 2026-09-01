import { useState } from "react";

import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import ExperienceSection from "./components/ExperienceSection";
import GameSection from "./components/GameSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectsSection from "./components/ProjectsSection";
import SystemSection from "./components/SystemSection";
import { portfolio } from "./data/portfolio";

const THEMES = ["lime", "blue", "orange"];

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = THEMES[themeIndex];

  const changeTheme = () => {
    setThemeIndex((current) => (current + 1) % THEMES.length);
  };

  return (
    <div className="site" data-theme={theme}>
      <Navbar theme={theme} onThemeChange={changeTheme} />

      <main>
        <Hero />
        <SystemSection />
        <ProjectsSection />
        <AboutSection />
        <ExperienceSection />
        <GameSection />
        <ContactSection />
      </main>

      <footer className="site-footer">
        <span>{portfolio.name.toUpperCase()} / 2026</span>
        <span>BUILT WITH INTENT.</span>
      </footer>
    </div>
  );
}
