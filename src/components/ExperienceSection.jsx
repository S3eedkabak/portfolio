import { portfolio } from "../data/portfolio";
export default function ExperienceSection({ t, content }) {
  const { experience } = portfolio;
  return <section className="experience-section"><div className="section-heading-v5"><div><p className="section-kicker">{t.experience.kicker}</p><h2>{t.experience.titleA} <em>{t.experience.titleB}</em></h2></div></div><article className="experience-card"><span className="experience-period">{experience.period}</span><div><h3>{experience.title}</h3><p className="experience-company">{experience.company}</p><p className="experience-description">{content.experience}</p></div><span className="experience-mark">UFZ</span></article></section>;
}
