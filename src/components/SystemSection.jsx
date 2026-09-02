import { useState } from "react";
import MacBookScene from "../MacBookScene";

const toolsCopy = {
  EN: {
    title: "The tools",
    description: "These tools help me do what I do.",
  },
  DE: {
    title: "Die Werkzeuge",
    description: "Diese Werkzeuge helfen mir bei dem, was ich tue.",
  },
  AR: {
    title: "الأدوات",
    description: "هاي الأدوات بتساعدني أعمل شغلي.",
  },
  SK: {
    title: "Nástroje",
    description: "Tieto nástroje mi pomáhajú robiť to, čo robím.",
  },
};

export default function SystemSection({ content, language }) {
  const [progress, setProgress] = useState(0);
  const copy = toolsCopy[language] ?? toolsCopy.EN;

  return (
    <section className="system-section" id="system">
      <div className="system-layout">
        <div className="system-copy">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>

        <div className="system-workbench">
          <div className="system-model-card">
            <MacBookScene progress={progress} />
          </div>

          <aside className="skill-panel" aria-label="Skills">
            <div className="skill-panel-head">
              <span>Skills</span>
              <strong>
                {String(Math.round(progress * 100)).padStart(3, "0")}&#37;
              </strong>
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
              <span>Assembly</span>
              <strong>{Math.round(progress * 100)}&#37;</strong>
            </div>

            <input
              className="assembly-range"
              aria-label="Assembly"
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              style={{ "--value": progress }}
              onChange={(event) => setProgress(Number(event.target.value))}
            />

            <div className="assembly-labels">
              <span>Closed</span>
              <span>Open</span>
              <span>Apart</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
