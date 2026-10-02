import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { MacKeyboard } from "./ui/mac-keyboard";

const EMAIL = "saeedkabak@gmail.com";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`;
const KEY_CODES = {
  s: "KeyS", a: "KeyA", e: "KeyE", d: "KeyD", k: "KeyK", b: "KeyB",
  "@": ["ShiftLeft", "Digit2"], g: "KeyG", m: "KeyM", i: "KeyI", l: "KeyL", ".": "Period",
  o: "KeyO", c: "KeyC",
};

export default function ContactSection({ t }) {
  const [typedCount, setTypedCount] = useState(0);
  const [run, setRun] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [started, setStarted] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);
    updateMotionPreference();
    media.addEventListener?.("change", updateMotionPreference);
    return () => media.removeEventListener?.("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTypedCount(EMAIL.length);
      return undefined;
    }
    if (!started) {
      setTypedCount(0);
      return undefined;
    }
    setTypedCount(0);
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setTypedCount((current) => {
          if (current >= EMAIL.length) {
            window.clearInterval(intervalId);
            return EMAIL.length;
          }
          return current + 1;
        });
      }, 115);
    }, 450);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [reducedMotion, started, run]);

  useEffect(() => {
    const node = contactRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    setStarted(true);
    setRun((value) => value + 1);
  };

  const currentKey = typedCount > 0 && typedCount <= EMAIL.length
    ? KEY_CODES[EMAIL[typedCount - 1]]
    : null;

  return (
    <section className="contact-section" id="contact" ref={contactRef}>
      <div className="contact-copy">
        <h2>
          {t.contact.titleA} <em>{t.contact.titleB}</em>
        </h2>
      </div>

      <div className="contact-console">
        <div className="contact-display">
          <div className="contact-display-topline">
            <span>{t.contact.email}</span>
            <button type="button" className="keyboard-replay" onClick={replay}>
              {t.contact.replay}
            </button>
          </div>
          <a
            className="contact-mail"
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`Compose an email to ${portfolio.email} in Gmail`}
          >
            <Mail size={19} aria-hidden="true" />
            <span className="typed-email" aria-hidden="true">{EMAIL.slice(0, typedCount)}<span className="typing-caret" /></span>
            <span className="email-accessible">{portfolio.email}</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </div>

        <div className="componentry-keyboard-scroll" aria-label="Interactive Mac keyboard">
          <MacKeyboard
            className="componentry-keyboard"
            highlightedKeys={currentKey ? (Array.isArray(currentKey) ? currentKey : [currentKey]) : []}
          />
        </div>
      </div>

      <div className="contact-socials">
        <a href={portfolio.github} target="_blank" rel="noreferrer">
          <Github size={16} />
          {t.contact.github}
        </a>
        <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={16} />
          {t.contact.linkedin}
        </a>
      </div>
    </section>
  );
}
