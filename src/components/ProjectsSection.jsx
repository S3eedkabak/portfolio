import { ArrowUpRight } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function ProjectsSection({ t, content }) {
  return (
    <section className="projects-section" id="work">
      <div className="section-heading-v5">
        <h2>
          {t.work.titleA} <em>{t.work.titleB}</em>
        </h2>
      </div>

      <div className="project-stack">
        {portfolio.projects.map((project, index) => (
          <a
            className="project-row"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            key={project.title}
          >
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{content.projects[index]?.[1] ?? project.description}</p>

              <div className="project-tags">
                {project.stack.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>

            <ArrowUpRight className="project-row-arrow" size={28} />
          </a>
        ))}
      </div>
    </section>
  );
}
