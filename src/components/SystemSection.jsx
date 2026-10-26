import { useTheme } from "../theme/ThemeProvider";
import { InView } from "./motion/primitives";
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
  const { palette } = useTheme();
  const items = useMemo(
    () => content.skills.map(([category, technologies], index) => ({
      id: `skills-${index + 1}`,
      title: category,
      subtitle: technologies.split(" · ").join("\n"),
      color: palette.books[index],
      foil: palette.foil,
    })),
    [content.skills, palette],
  );

  return (
    <section className="system-section" id="system">
      <InView className="system-copy">
        <h2>
          {t.system.titleA} <em>{t.system.titleB}</em>
        </h2>
        <p className="system-description">{t.system.description}</p>
        <p className="bookshelf-instruction">{t.system.bookshelfHint}</p>
      </InView>
      <div className="shelf-installation"><div className="shelf-halo" aria-hidden="true" /><SkillsBoundary>
        <Suspense fallback={<div className="componentry-bookshelf-loading" aria-hidden="true" />}>
          <NewsletterBookshelf
            items={items}
            brand="Saeid Kabak"
            height="clamp(620px, 76vw, 820px)"
            className="componentry-skills-bookshelf"
          />
        </Suspense>
      </SkillsBoundary></div>
    </section>
  );
}
