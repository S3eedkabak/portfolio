import { portfolio } from "../data/portfolio";

export default function ExperienceSection() {
  const { experience } = portfolio;

  return (
    <section className="experience-section">
      <div className="section-heading-v5">
        <div>
          <p className="section-kicker">04 / Experience</p>
          <h2>Production, <em>not theory.</em></h2>
        </div>
      </div>

      <article className="experience-card">
        <span className="experience-period">{experience.period}</span>
        <div>
          <h3>{experience.title}</h3>
          <p className="experience-company">{experience.company}</p>
          <p className="experience-description">{experience.description}</p>
        </div>
        <span className="experience-mark">UFZ</span>
      </article>
    </section>
  );
}
