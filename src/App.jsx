import { useState } from "react";

import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import ExperienceSection from "./components/ExperienceSection";
import GameSection from "./components/GameSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectsSection from "./components/ProjectsSection";
import SystemSection from "./components/SystemSection";
import "./styles.css";

const themes = ["lime", "blue", "orange"];

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0);

  const changeTheme = () => {
    setThemeIndex((current) => (current + 1) % themes.length);
  };

  const theme = themes[themeIndex];

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
        <span>SAEID KABAK / 2026</span>
        <span>BUILT WITH INTENT.</span>
      </footer>
    </div>
  );
}
