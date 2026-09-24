import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const REPO_IMAGE = "https://opengraph.githubassets.com/1/S3eedkabak/test";

function KeyGrid() {
  return (
    <div className="project-macbook-keyboard">
      {Array.from({ length: 70 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export default function MacbookShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.08, 1.32]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.72, 1.32]);
  const rotateX = useTransform(scrollYProgress, [0.1, 0.13, 0.3], [-24, -24, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.72], [0, 620]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, 65]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={ref} className="macbook-showcase">
      <motion.div className="macbook-copy" style={{ y: titleY, opacity: titleOpacity }}>
        <span className="macbook-kicker">PUBLIC WORKBENCH</span>
        <h3>A developer who actually ships.<em>GitHub is the receipt.</em></h3>
        <p>Scroll through the machine, then open the repository behind the work.</p>
        <a
          href="https://github.com/S3eedkabak/test"
          target="_blank"
          rel="noreferrer"
          className="macbook-link"
        >
          Open the repo ↗
        </a>
      </motion.div>

      <div className="macbook-stage">
        <div
          className="macbook-demo-lid"
          style={{ transform: "perspective(1100px) rotateX(-25deg)", transformOrigin: "center bottom" }}
        >
          <div className="macbook-demo-logo" aria-hidden="true">
            <span>⌘</span>
          </div>
        </div>

        <motion.div
          className="macbook-lid"
          style={{
            scaleX,
            scaleY,
            rotateX,
            y: translateY,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
          }}
        >
          <div className="macbook-bezel">
            <img src={REPO_IMAGE} alt="GitHub repository preview" />
          </div>
        </motion.div>

        <div className="macbook-base">
          <KeyGrid />
          <div className="macbook-trackpad" />
        </div>
      </div>
    </div>
  );
}