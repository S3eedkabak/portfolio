import { Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";
import AsciiEffect from "./ui/AsciiEffect";
import { Signature } from "./ui/signature.tsx";

const COMPONENTRY_PORTRAIT = "https://componentry.dev/images/portrait.jpg";

export default function Hero({ t, content }) {
  return (
    <section className="hero" id="top">
      <AsciiEffect
        className="hero-ascii"
        imageSrc={COMPONENTRY_PORTRAIT}
        alt="Portrait rendered as flowing ASCII characters"
      />
      <div className="hero-wash" aria-hidden="true" />

      <div className="hero-rail">
        <span>{t.hero.role}</span>
        <span>{portfolio.location}</span>
      </div>

      <div className="hero-content">
        <Signature
          text="Saeid Kabak"
          fontUrl="/fonts/LastoriaBoldRegular.otf"
          color="#f4f0e5"
          fontSize={132}
          duration={1.35}
          inView
          once
          className="hero-signature hero-signature-primary"
        />
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
        <a className="hero-scroll" href="#system">{t.hero.explore}</a>
      </div>
    </section>
  );
}
