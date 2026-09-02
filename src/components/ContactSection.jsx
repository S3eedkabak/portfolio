import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";
export default function ContactSection({ t }) {
  return <section className="contact-section" id="contact"><h2>{t.contact.titleA} <em>{t.contact.titleB}</em></h2><a className="contact-mail" href={`mailto:${portfolio.email}`}><Mail size={18}/>{portfolio.email}<ArrowUpRight size={18}/></a><div className="contact-socials"><a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16}/> {t.contact.github}</a><a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16}/> {t.contact.linkedin}</a></div></section>;
}
