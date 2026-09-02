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
import { getSyrianArabic } from "./data/syrianArabic";

export default function App() {
  const [language, setLanguage] = useState("EN");
  const baseTranslation = getTranslation(language);
  const baseContent = getContent(language);
  const localized = language === "AR"
    ? getSyrianArabic(baseTranslation, baseContent)
    : { translation: baseTranslation, content: baseContent };

  return (
    <div
      className="site theme-paper"
      lang={language.toLowerCase()}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        t={localized.translation}
      />
      <main>
        <Hero t={localized.translation} content={localized.content} />
        <SystemSection
          t={localized.translation}
          content={localized.content}
          language={language}
        />
        <ProjectsSection t={localized.translation} content={localized.content} />
        <AboutSection t={localized.translation} content={localized.content} />
        <ExperienceSection t={localized.translation} content={localized.content} />
        <GameSection t={localized.translation} />
        <ContactSection t={localized.translation} />
      </main>
      <footer className="site-footer">
        <span>{localized.translation.footer}</span>
        <span />
      </footer>
    </div>
  );
}
