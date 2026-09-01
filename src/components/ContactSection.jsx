import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <p className="section-kicker">06 / Get in touch</p>
      <h2>Have a hard <em>problem?</em></h2>
      <a className="contact-mail" href={`mailto:${portfolio.email}`}>
        <Mail size={18} />
        {portfolio.email}
        <ArrowUpRight size={18} />
      </a>

      <div className="contact-socials">
        <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
        <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
      </div>
    </section>
  );
}
