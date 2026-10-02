import { Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function AboutSection({ t, content }) {
  return (
    <section className="about-section" id="about">
      <div className="about-intro">
        <h2>
          {t.about.titleA} <em>{t.about.titleB}</em>
        </h2>
        <p className="about-lead">{t.about.lead}</p>
      </div>

      <div className="about-copy">
        <p>{content.education}</p>
        <p>{t.about.body}</p>

        <div className="social-links">
          <a href={portfolio.github} target="_blank" rel="noreferrer">
            <Github size={16} />
            {t.contact.github}
          </a>
          <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={16} />
            {t.contact.linkedin}
          </a>
          <a href={`mailto:${portfolio.email}`}>
            <Mail size={16} />
            {t.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
