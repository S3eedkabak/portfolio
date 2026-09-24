import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function RobotPanel({ t }) {
  return (
    <motion.section
      className="robot-panel"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      aria-label="Interactive 3D contact panel"
    >
      <div className="robot-copy">
        <span className="robot-kicker">INTERACTIVE 3D</span>
        <h2>
          {t.contact.titleA} <em>{t.contact.titleB}</em>
        </h2>
        <p>Have a difficult problem, a rough idea, or something that needs building? Send it over.</p>
        <a href="#contact" className="robot-link">
          Let's connect <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="robot-scene">
        <iframe
          title="Interactive 3D robot"
          src={SCENE}
          loading="lazy"
          allow="autoplay; fullscreen"
        />
      </div>
    </motion.section>
  );
}