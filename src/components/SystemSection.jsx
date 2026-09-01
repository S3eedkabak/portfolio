import { useState } from "react";
import MacBookScene from "../MacBookScene";
import { portfolio } from "../data/portfolio";

export default function SystemSection() {
  const [progress, setProgress] = useState(0);

  return (
    <section className="system-section" id="system">
      <div className="system-copy">
        <p className="section-kicker">01 / Under the hood</p>
        <h2>Take it <em>apart.</em></h2>
        <p className="system-description">
          A visual inventory of the tools I use to turn messy requirements into software that can survive real constraints.
        </p>
      </div>

      <div className="system-stage">
        <div className="system-model">
          <MacBookScene progress={progress} />
        </div>

        <aside className="skill-panel" aria-label="Technical skills">
          <div className="skill-panel-head">
            <span>ENGINEERING PROFILE</span>
            <span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
          </div>
          {portfolio.skills.map((skill, index) => (
            <article
              className={progress >= (index + 1) / (portfolio.skills.length + 1) ? "skill-card is-active" : "skill-card"}
              key={skill.label}
            >
              <span className="skill-index">0{index + 1}</span>
              <div>
                <small>{skill.label}</small>
                <strong>{skill.value}</strong>
              </div>
            </article>
          ))}
        </aside>

        <div className="assembly-control">
          <div className="control-copy">
            <span>ASSEMBLY</span>
            <strong>{Math.round(progress * 100)}%</strong>
          </div>
          <input
            aria-label="MacBook assembly progress"
            className="assembly-range"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
          />
          <div className="assembly-labels">
            <span>CLOSED</span>
            <span>OPEN</span>
            <span>APART</span>
          </div>
        </div>
      </div>
    </section>
  );
}
