import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { InView, Magnetic } from "./motion/primitives";
import { portfolio } from "../data/portfolio";
import AsciiEffect from "./ui/AsciiEffect";
import { Signature } from "./ui/signature.tsx";
import spiderSource from "../assets/spider.svg";

export default function Hero({ t, content }) {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 55]);
  return (
    <section className="hero" id="top" ref={heroRef}>
      <motion.div className="hero-art-parallax" style={{ y: parallax }} aria-hidden="true">
      <AsciiEffect
        className="hero-ascii"
        imageSrc={spiderSource}
        alt="Spider-Man rendered as flowing ASCII characters"
      />
      </motion.div>
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true" /><div className="hero-horizon" aria-hidden="true" />

      <div className="hero-rail">
        <span>{t.hero.role}</span>
        <span>{portfolio.location}</span>
      </div>

      <div className="hero-content">
        <h1 className="email-accessible">Saeid Kabak</h1>
        <Signature
          text="Saeid Kabak"
          fontUrl="/fonts/LastoriaBoldRegular.otf"
          color="var(--color-hero-foreground)"
          fontSize={132}
          duration={0.85}
          inView
          once
          className="hero-signature hero-signature-primary"
        />
        <InView delay={0.2}><p className="hero-bio">{content.bio}</p></InView>
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
        <Magnetic><a className="hero-scroll" href="#system">{t.hero.explore}<ArrowDown size={18} /></a></Magnetic>
      </div>
    </section>
  );
}
