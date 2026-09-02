import { ArrowUpRight, ExternalLink } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function ProjectsSection({ t }) {
  const copy = {
    EN: ["FIELD SYSTEMS", "AI INFRASTRUCTURE"],
    DE: ["FELDSYSTEME", "KI-INFRASTRUKTUR"],
    AR: ["أنظمة ميدانية", "بنية الذكاء الاصطناعي"],
    SK: ["POĽNÉ SYSTÉMY", "AI INFRAŠTRUKTÚRA"],
  };

  return (
    <section className="projects-section" id="work">
      <div className="section-heading-v5">
        <div>
          <p className="section-kicker">{t.work.kicker}</p>
          <h2>{t.work.titleA} <em>{t.work.titleB}</em></h2>
        </div>
        <p>{t.work.intro}</p>
      </div>

      <div className="project-stack">
        {portfolio.projects.map((project, index) => (
          <a className="project-row" href={project.url} target="_blank" rel="noreferrer" key={project.title}>
            <span className="project-number">{project.number}</span>
            <div className="project-content">
              <div className="project-meta"><span>{copy["EN"][index]}</span><ExternalLink size={14} /></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
            </div>
            <ArrowUpRight className="project-row-arrow" size={28} />
          </a>
        ))}
      </div>
    </section>
  );
}
