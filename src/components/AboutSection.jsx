import { Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-intro">
        <div>
          <p className="section-kicker"></p>
          <h2>More than <em>the stack.</em></h2>
        </div>
        <p className="about-lead">
          I like difficult problems for the right reasons. Systems should be understandable, resilient, and built around the people who have to use them.
        </p>
      </div>

      <div className="about-grid-v5">
        <div className="about-copy">
          <p>{portfolio.education}</p>
          <p>
            My work sits at the intersection of software engineering, AI, and the consumer. I care about the boring details that make the flashy demo survive Monday morning.
          </p>

          <div className="social-links">
            <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
            <a href={`mailto:${portfolio.email}`}><Mail size={16} /> Email</a>
          </div>
        </div>

        <div className="skill-table">
          {portfolio.skills.map((skill, index) => (
            <div className="skill-table-row" key={skill.label}>
              <span>0{index + 1}</span>
              <strong>{skill.label}</strong>
              <p>{skill.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
