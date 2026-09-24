import MacbookScroll from "./MacbookScroll";

export default function SystemSection({ t, content }) {
  return (
    <section className="system-section" id="system">
      <div className="system-layout">
        <div className="system-copy">
          <h2>{t.system.titleA} <em>{t.system.titleB}</em></h2>
        </div>

        <div className="system-workbench">
          <div className="system-model-card">
            <MacbookScroll />
          </div>

          <aside className="skill-panel" aria-label="Skills">
            <div className="skill-panel-head">
              <span>Skills</span>
              <strong>{String(content.skills.length).padStart(2, "0")}</strong>
            </div>

            {content.skills.map(([label, value], index) => (
              <article className="skill-card is-active" key={label}>
                <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
