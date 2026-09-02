import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SystemSection from "./components/SystemSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import GameSection from "./components/GameSection";
import ContactSection from "./components/ContactSection";
import { themes } from "./data/portfolio";

export default function App() {
  const [themeIndex, setThemeIndex] = useState(1);
  const theme = themes[themeIndex];

  const cycleTheme = () => {
    setThemeIndex((current) => (current + 1) % themes.length);
  };

  return (
    <div className={`site theme-${theme.id}`}>
      <Navbar theme={theme.label} onThemeChange={cycleTheme} />
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
        <span>SAEID KABAK © 2026</span>
        <span></span>
      </footer>
    </div>
  );
}
