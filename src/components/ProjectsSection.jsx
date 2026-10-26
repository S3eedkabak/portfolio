import greenpointArtwork from "../assets/project-greenpoint.svg";
import marpArtwork from "../assets/project-marp.svg";
import bacityArtwork from "../assets/project-bacity.svg";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { portfolio } from "../data/portfolio";
import { InView } from "./motion/primitives";
import { springs } from "../lib/motion";

const projectArtwork = [greenpointArtwork, marpArtwork, bacityArtwork];

function ProjectArtwork({ index }) {
  return <img
    className={`project-artwork-image artwork-${index}`}
    src={projectArtwork[index]}
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    draggable="false"
  />;
}

function Project({ project, description, index }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springs.surface);
  const sy = useSpring(y, springs.surface);
  const artX = useTransform(sx, (v) => v * 10);
  const artY = useTransform(sy, (v) => v * 8);
  return <InView variant="settle" as="article" className={`project-scene project-scene-${index}`}>
    <a className="project-row" href={project.url} target="_blank" rel="noreferrer"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className="project-content"><h3>{project.title}</h3><p>{description}</p></div>
      <motion.div className="project-visual" style={{ x: artX, y: artY }}><ProjectArtwork index={index} /></motion.div>
      <div className="project-tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <span className="project-arrow-shell"><ArrowUpRight className="project-row-arrow" size={28} /></span>
    </a>
  </InView>;
}

export default function ProjectsSection({ t, content }) {
  return <section className="projects-section" id="work">
    <InView className="section-heading-v5"><h2>{t.work.titleA} <em>{t.work.titleB}</em></h2></InView>
    <div className="project-stack">{portfolio.projects.map((project, index) => <Project key={project.title} project={project} description={content.projects[index]?.[1] ?? project.description} index={index} />)}</div>
  </section>;
}
