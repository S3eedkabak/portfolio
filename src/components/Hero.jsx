import { ArrowDownRight, Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function Hero() {
  const scrollToSystem = () => {
    document.getElementById("system")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-v5" id="top">
      <div className="hero-noise" />

      <div className="hero-topline">
        <span>{portfolio.role}</span>
        <span>{portfolio.location}</span>
      </div>

      <div className="hero-main">
        <div>
          <p className="eyebrow">Engineer / builder / problem solver</p>
          <h1>
            Saeid <em>Kabak</em>
          </h1>
          <p className="hero-intro">{portfolio.bio}</p>
        </div>

        <div className="hero-side">
          <span className="hero-side-number">01</span>
          <span className="hero-side-rule" />
          <span>BUILDING<br />BEYOND THE<br />OBVIOUS.</span>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-links">
          <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
          <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
        </div>

        <button className="hero-scroll" onClick={scrollToSystem}>
          <span>ENTER THE SYSTEM</span>
          <ArrowDownRight size={18} />
        </button>
      </div>
    </section>
  );
}
