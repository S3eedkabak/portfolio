import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const REPO_IMAGE = "https://opengraph.githubassets.com/1/S3eedkabak/test";

export default function MacbookShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], [-28, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.94, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.75, 1], [24, 0, -10]);
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [0.98, 1]);

  return (
    <div ref={ref} className="macbook-showcase">
      <div className="macbook-copy">
        <span className="macbook-kicker">PUBLIC WORKBENCH</span>
        <h3>A developer who actually ships.<em> GitHub is the receipt.</em></h3>
        <p>One small interactive proof of the engineering behind the work. Scroll to open it, then open the repository.</p>
        <a
          href="https://github.com/S3eedkabak/test"
          target="_blank"
          rel="noreferrer"
          className="macbook-link"
        >
          Open the repo ↗
        </a>
      </div>

      <div className="macbook-stage">
        <motion.div
          className="macbook-lid"
          style={{
            rotateX,
            scale,
            y: translateY,
          }}
        >
          <div className="macbook-bezel">
            <motion.img
              src={REPO_IMAGE}
              alt="GitHub repository preview"
              style={{ scale: imageScale }}
            />
          </div>
        </motion.div>

        <div className="macbook-base">
          <div className="macbook-keyboard">
            {Array.from({ length: 54 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="macbook-trackpad" />
        </div>
      </div>
    </div>
  );
}