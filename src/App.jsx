import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SystemSection from "./components/SystemSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import GameSection from "./components/GameSection";
import ContactSection from "./components/ContactSection";
import { getTranslation, getContent } from "./data/i18n";

export default function App() {
  const [language, setLanguage] = useState("EN");
  const t = getTranslation(language);
  const content = getContent(language);

  return (
    <div className="site theme-paper" lang={language.toLowerCase()} dir={language === "AR" ? "rtl" : "ltr"}>
      <Navbar language={language} onLanguageChange={setLanguage} t={t} />
      <main>
        <Hero t={t} content={content} />
        <SystemSection t={t} content={content} />
        <ProjectsSection t={t} content={content} />
        <AboutSection t={t} content={content} />
        <ExperienceSection t={t} content={content} />
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
