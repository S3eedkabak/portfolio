import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { portfolio } from "../data/portfolio";
import { InView } from "./motion/primitives";
import { springs } from "../lib/motion";

function ProjectArtwork({ index }) {
  return <svg className={`project-artwork artwork-${index}`} viewBox="0 0 600 440" fill="none" aria-hidden="true">
    {index === 0 ? <>
      {[0,1,2,3,4].map((row) => <g key={row} transform={`translate(${120 + row * 55} ${80 + row % 2 * 40})`}><path d="M0 210V48M-40 105L0 35L40 105M-55 150L0 70L55 150M-65 195L0 110L65 195" /><ellipse cy="220" rx="55" ry="15" /></g>)}
      <path d="M90 340L300 390L520 315M90 365L300 415L520 340" />
    </> : index === 1 ? <>
      <path d="M90 220L240 100L420 145L510 310L320 350L90 220L420 145M240 100L320 350M90 220L510 310" />
      {[[90,220],[240,100],[420,145],[510,310],[320,350]].map(([x,y],i) => <g key={i} transform={`translate(${x} ${y})`}><circle r="36" /><circle r="24" /><path d="M-8-8H8V8H-8Z" /></g>)}
      <ellipse cx="300" cy="220" rx="240" ry="170" strokeDasharray="3 12" />
    </> : <>
      <path d="M75 290L275 390L535 250L340 150L75 290ZM135 260L335 360M200 225L400 325M270 190L470 290M135 320L395 180M200 355L460 215" />
      {[[200,240,75],[325,200,110],[400,280,60],[280,310,45]].map(([x,y,h],i) => <g key={i}><path d={`M${x} ${y}v-${h}l30 -16l30 16v${h}l-30 16Z M${x} ${y-h}l30 16l30 -16 M${x+30} ${y-h+16}v${h}`} /></g>)}
      <path d="M325 70C300 70 290 100 325 130C360 100 350 70 325 70Z" /><circle cx="325" cy="92" r="6" />
    </>}
  </svg>;
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
