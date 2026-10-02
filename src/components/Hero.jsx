import { Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";
import AsciiEffect from "./ui/AsciiEffect";
import { Signature } from "./ui/signature.tsx";
import asciiSource from "../assets/ascii-field.svg";

export default function Hero({ t, content }) {
  return (
    <section className="hero" id="top">
      <AsciiEffect
        className="hero-ascii"
        imageSrc={asciiSource}
        alt="Abstract orbital line drawing rendered as flowing ASCII characters"
      />
      <div className="hero-wash" aria-hidden="true" />

      <div className="hero-rail">
        <span>{t.hero.role}</span>
        <span>{portfolio.location}</span>
      </div>

      <div className="hero-content">
        <h1>
          Saeid <em>Kabak</em>
        </h1>
        <p className="hero-bio">{content.bio}</p>
        <Signature
          text="Saeid Kabak"
          fontUrl="/fonts/LastoriaBoldRegular.otf"
          color="#d0b47a"
          fontSize={38}
          duration={1.5}
          inView
          once
          className="hero-signature"
        />
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
        <a className="hero-scroll" href="#system">{t.hero.explore}</a>
      </div>
    </section>
  );
}
