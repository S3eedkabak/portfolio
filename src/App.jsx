import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SystemSection from "./components/SystemSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import GameSection from "./components/GameSection";
import ContactSection from "./components/ContactSection";
import { getTranslation } from "./data/i18n";

export default function App() {
  const [language, setLanguage] = useState("EN");
  const t = getTranslation(language);

  return (
    <div className="site theme-paper" lang={language.toLowerCase()} dir={language === "AR" ? "rtl" : "ltr"}>
      <Navbar language={language} onLanguageChange={setLanguage} t={t} />
      <main>
        <Hero t={t} />
        <SystemSection t={t} />
        <ProjectsSection t={t} language={language} />
        <AboutSection t={t} />
        <ExperienceSection t={t} />
        <GameSection t={t} />
        <ContactSection t={t} />
      </main>
      <footer className="site-footer">
        <span>{t.footer}</span>
        <span></span>
      </footer>
    </div>
  );
}
