import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const KEY_ROWS = [
  ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "●"],
  ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "delete"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\\\"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["fn", "control", "option", "command", "", "command", "option", "←", "↓", "→"],
];

export default function MacbookScroll() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.12, isMobile ? 1 : 1.35]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.64, isMobile ? 1 : 1.35]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, 430]);
  const rotate = useTransform(scrollYProgress, [0.08, 0.16, 0.3], [-28, -28, 0]);

  return (
    <div ref={ref} className="portfolio-macbook-scroll">
      <div className="portfolio-macbook-stage">
        <div className="portfolio-macbook-title">
          <span>MACBOOK / 001</span>
          <strong>MY WORKSTATION</strong>
        </div>

        <div className="portfolio-macbook-lid">
          <div className="portfolio-macbook-lid-inner">
            <AceternityLogo />
          </div>
        </div>

        <motion.div
          className="portfolio-macbook-screen"
          style={{
            scaleX,
            scaleY,
            rotateX: rotate,
            translateY: translate,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
          }}
        >
          <div className="portfolio-macbook-screen-bezel">
            <img
              src="https://opengraph.githubassets.com/1/S3eedkabak/test"
              alt="Preview of Saeid Kabak's GitHub project"
            />
          </div>
        </motion.div>

        <div className="portfolio-macbook-base">
          <div className="portfolio-macbook-topbar" />
          <div className="portfolio-macbook-deck">
            <SpeakerGrid />
            <Keypad />
            <SpeakerGrid />
          </div>
          <div className="portfolio-macbook-trackpad" />
          <div className="portfolio-macbook-front" />
        </div>
      </div>
    </div>
  );
}

function SpeakerGrid() {
  return <div className="portfolio-macbook-speaker-grid" aria-hidden="true" />;
}

function Keypad() {
  return (
    <div className="portfolio-macbook-keypad">
      {KEY_ROWS.map((row, rowIndex) => (
        <div className="portfolio-macbook-key-row" key={rowIndex}>
          {row.map((key, index) => (
            <span
              className={key === "" ? "portfolio-macbook-key portfolio-macbook-space" : "portfolio-macbook-key"}
              key={index}
            >
              {key}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function AceternityLogo() {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
}
