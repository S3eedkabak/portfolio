import { ArrowDownRight, Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function Hero() {
  const enterSystem = () => document.getElementById("system")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero" id="top">
      <div className="hero-rail">
        <span>SOFTWARE ENGINEER</span>
        <span>{portfolio.location}</span>
      </div>
      <div className="hero-content">
        <p className="eyebrow">Engineer / builder / problem solver</p>
        <h1>Saeid <em>Kabak</em></h1>
        <p className="hero-bio">{portfolio.bio}</p>
      </div>
      <div className="hero-footer">
        <div className="hero-links">
          <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={15}/>GitHub</a>
          <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15}/>LinkedIn</a>
        </div>
        <button className="text-button" onClick={enterSystem}>Explore the work <ArrowDownRight size={17}/></button>
      </div>
    </section>
  );
}