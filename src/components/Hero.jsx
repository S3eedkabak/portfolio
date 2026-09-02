import { Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function Hero({ t, content }) {
  return (
    <section className="hero" id="top">
      <div className="hero-rail">
        <span>{t.hero.role}</span>
        <span>{portfolio.location}</span>
      </div>

      <div className="hero-content">
        <h1>
          Saeid <em>Kabak</em>
        </h1>
        <p className="hero-bio">{content.bio}</p>
      </div>

      <div className="hero-footer">
        <div className="hero-links">
          <a href={portfolio.github} target="_blank" rel="noreferrer">
            <Github size={15} />
            {t.contact.github}
          </a>
          <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} />
            {t.contact.linkedin}
          </a>
        </div>
      </div>
    </section>
  );
}
