import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

export default function ProjectMacbook() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [-26, 0]);
  const y = useTransform(scrollYProgress, [0, 0.85], [36, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.94, 1]);

  return (
    <div ref={ref} className="project-macbook">
      <div className="project-macbook-copy">
        <span>PUBLIC WORKBENCH</span>
        <h3>
          A developer who actually ships.
          <em>GitHub is the receipt.</em>
        </h3>
        <p>Scroll through the machine, then open the repository behind the work.</p>
        <a
          href="https://github.com/S3eedkabak/test"
          target="_blank"
          rel="noreferrer"
        >
          Open the repo ↗
        </a>
      </div>

      <div className="project-macbook-stage">
        <motion.div
          className="project-macbook-screen"
          style={{ rotateX, y, scale }}
        >
          <div className="project-macbook-display">
            <img src={REPO_IMAGE} alt="GitHub repository preview" />
          </div>
        </motion.div>

        <div className="project-macbook-base">
          <KeyGrid />
          <div className="project-macbook-trackpad" />
        </div>
      </div>
    </div>
  );
}