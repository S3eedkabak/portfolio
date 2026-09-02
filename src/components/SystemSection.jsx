import { useState } from "react";
import MacBookScene from "../MacBookScene";
import { portfolio } from "../data/portfolio";

export default function SystemSection() {
  const [progress, setProgress] = useState(0);

  return (
    <section className="system-section" id="system">
      <div className="system-layout">
        <div className="system-copy">
          <p className="section-kicker"></p>
          <h2>Take it <em>apart.</em></h2>
          <p>
            My box of tools I use to turn messy requirements into software
          </p>
        </div>

        <div className="system-workbench">
          <div className="system-model-card">
            <MacBookScene progress={progress} />
            <span className="model-caption">My Macbook, that helps me do what i do. </span>
          </div>

          <aside className="skill-panel" aria-label="Technical skills">
            <div className="skill-panel-head">
              <span>TECHNICAL PROFILE</span>
              <strong>{String(Math.round(progress * 100)).padStart(3, "0")}%</strong>
            </div>
            {portfolio.skills.map((skill, index) => {
              const threshold = 0.08 + index * 0.18;
              const active = progress >= threshold;

              return (
                <article className={active ? "skill-card is-active" : "skill-card"} key={skill.label}>
                  <span className="skill-index">0{index + 1}</span>
                  <div>
                    <small>{skill.label}</small>
                    <strong>{skill.value}</strong>
                  </div>
                </article>
              );
            })}
          </aside>

          <div className="assembly-control">
            <div className="control-copy">
              <span>ASSEMBLY</span>
              <strong>{Math.round(progress * 100)}%</strong>
            </div>
            <input
              className="assembly-range"
              aria-label="MacBook assembly progress"
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              style={{ "--value": progress }}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
            <div className="assembly-labels">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
