import { Link } from "react-router-dom";
import { renderInline } from "./inlineMarkup";
import { docs } from "../data/docs";

export default function DocsPage({ doc }) {
  const isOverview = doc.slug === "overview";

  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <h1>{doc.title}</h1>
        <p className="docs-page__tagline">{doc.tagline}</p>
      </header>

      {doc.sections.map((section) => (
        <section key={section.heading} className="docs-section">
          <h2>{section.heading}</h2>
          {section.body?.map((paragraph, i) => (
            <p key={i}>{renderInline(paragraph)}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {isOverview && (
        <section className="docs-section docs-deepdive-grid">
          <h2>Deep dives</h2>
          <div className="docs-cards">
            {docs
              .filter((d) => d.slug !== "overview")
              .map((d) => (
                <Link key={d.slug} to={`/docs/${d.slug}`} className="docs-card">
                  <span className="docs-card__title">{d.title}</span>
                  <span className="docs-card__tagline">{d.tagline}</span>
                </Link>
              ))}
          </div>
        </section>
      )}
    </article>
  );
}
