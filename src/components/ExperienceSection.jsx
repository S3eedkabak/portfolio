import { InView } from "./motion/primitives";
import { portfolio } from "../data/portfolio";

export default function ExperienceSection({ t, content }) {
  const { experience } = portfolio;

  return (
    <section className="experience-section" id="experience">
      <InView className="section-heading-v5">
        <h2>
          {t.experience.titleA} <em>{t.experience.titleB}</em>
        </h2>
      </InView>

      <InView as="article" variant="settle" className="experience-card">
        <div>
          <p className="experience-period">{experience.period}</p>
          <h3>{experience.title}</h3>
          <p className="experience-company">{experience.company}</p>
          <p className="experience-description">{content.experience}</p>
        </div>
      </InView>
    </section>
  );
}
