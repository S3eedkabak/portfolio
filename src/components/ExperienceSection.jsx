import { portfolio } from "../data/portfolio";

export default function ExperienceSection({ content }) {
  const { experience } = portfolio;

  return (
    <section className="experience-section">
      <div className="section-heading-v5">
        <h2>
          Production, <em>not theory.</em>
        </h2>
      </div>

      <article className="experience-card">
        <span className="experience-period">{experience.period}</span>

        <div>
          <h3>{experience.title}</h3>
          <p className="experience-company">{experience.company}</p>
          <p className="experience-description">{content.experience}</p>
        </div>

        <span className="experience-mark">UFZ</span>
      </article>
    </section>
  );
}
