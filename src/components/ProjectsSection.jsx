import { ArrowUpRight, ExternalLink } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function ProjectsSection() {
  return (
    <section className="projects-section" id="work">
      <div className="section-heading-v5">
        <div>
          <p className="section-kicker">02 / Selected work</p>
          <h2>Things I've <em>built.</em></h2>
        </div>
        <p>
          Two real systems. No stock mockups, no fake dashboards, no decorative bullshit. Click through to the repositories.
        </p>
      </div>

      <div className="project-stack">
        {portfolio.projects.map((project) => (
          <a
            className="project-row"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            key={project.title}
          >
            <span className="project-number">{project.number}</span>
            <div className="project-content">
              <div className="project-meta"><span>{project.category}</span><ExternalLink size={14} /></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
              </div>
            </div>
            <ArrowUpRight className="project-row-arrow" size={28} />
          </a>
        ))}
      </div>
    </section>
  );
}
