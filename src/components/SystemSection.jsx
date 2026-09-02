import { useState } from "react";
import MacBookScene from "../MacBookScene";

export default function SystemSection({ t, content }) {
  const [progress, setProgress] = useState(0);

  return (
    <section className="system-section" id="system">
      <div className="system-layout">
        <div className="system-copy">
          <h2>
            {t.system.titleA} <em>{t.system.titleB}</em>
          </h2>
        </div>

        <div className="system-workbench">
          <div className="system-model-card">
            <MacBookScene progress={progress} />
          </div>

          <aside className="skill-panel" aria-label="Skills">
            <div className="skill-panel-head">
              <span>Skills</span>
              <strong>{String(Math.round(progress * 100)).padStart(3, "0")}%</strong>
            </div>

            {content.skills.map(([label, value], index) => {
              const active = progress >= 0.08 + index * 0.18;

              return (
                <article
                  className={active ? "skill-card is-active" : "skill-card"}
                  key={label}
                >
                  <span className="skill-index">0{index + 1}</span>
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                </article>
              );
            })}
          </aside>

          <div className="assembly-control">
            <div className="control-copy">
              <span>{t.system.assembly}</span>
              <strong>{Math.round(progress * 100)}%</strong>
            </div>

            <input
              className="assembly-range"
              aria-label={t.system.assembly}
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              style={{ "--value": progress }}
              onChange={(event) => setProgress(Number(event.target.value))}
            />

            <div className="assembly-labels">
              <span>{t.system.closed}</span>
              <span>{t.system.open}</span>
              <span>{t.system.apart}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
