import { Component, Suspense, lazy, useMemo } from "react";

const NewsletterBookshelf = lazy(() =>
  import("./ui/newsletter-bookshelf").then(({ NewsletterBookshelf }) => ({
    default: NewsletterBookshelf,
  })),
);

class SkillsBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed
      ? <div className="componentry-bookshelf-fallback" role="status">The interactive bookshelf could not be loaded.</div>
      : this.props.children;
  }
}

export default function SystemSection({ t, content }) {
  const items = useMemo(
    () => content.skills.map(([category, technologies], index) => ({
      id: `skills-${index + 1}`,
      title: category,
      subtitle: technologies.split(" · ").join("\n"),
      color: ["#34463e", "#49584d", "#625b46", "#3a504b", "#59614d"][index],
      foil: "#e7dfcf",
    })),
    [content.skills],
  );

  return (
    <section className="system-section" id="system">
      <div className="system-copy">
        <h2>
          {t.system.titleA} <em>{t.system.titleB}</em>
        </h2>
        <p className="system-description">{t.system.description}</p>
        <p className="bookshelf-instruction">{t.system.bookshelfHint}</p>
      </div>
      <SkillsBoundary>
        <Suspense fallback={<div className="componentry-bookshelf-loading" aria-hidden="true" />}>
          <NewsletterBookshelf
            items={items}
            brand="Saeid Kabak"
            height="clamp(620px, 76vw, 820px)"
            className="componentry-skills-bookshelf"
          />
        </Suspense>
      </SkillsBoundary>
    </section>
  );
}
