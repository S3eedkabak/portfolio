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

  const systemTranslation = language === "AR"
    ? {
        ...localized.translation.system,
        titleA: "الأدوات",
        titleB: ".",
      }
    : localized.translation.system;

  const pageTranslation = language === "AR"
    ? {
        ...localized.translation,
        system: systemTranslation,
      }
    : localized.translation;

  return (
    <div
      className="site theme-paper"
      lang={language.toLowerCase()}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        t={pageTranslation}
      />
      <main>
        <Hero t={pageTranslation} content={localized.content} />
        <SystemSection t={pageTranslation} content={localized.content} />
        <ProjectsSection t={pageTranslation} content={localized.content} />
        <AboutSection t={pageTranslation} content={localized.content} />
        <ExperienceSection t={pageTranslation} content={localized.content} />
        <GameSection t={pageTranslation} />
        <ContactSection t={pageTranslation} />
      </main>
      <footer className="site-footer">
        <span>{pageTranslation.footer}</span>
        <span />
      </footer>
    </div>
  );
}
