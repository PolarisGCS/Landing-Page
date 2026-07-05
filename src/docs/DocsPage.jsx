import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docs } from "./docsData";
import { useLightbox } from "./LightboxContext";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

/** Screenshots of small popovers/dialogs read better capped narrower than full-width shots. */
function isCompactScreenshot(src, alt) {
  const s = (src || "").toLowerCase();
  const a = (alt || "").toLowerCase();
  return (
    s.includes("connected_devices") ||
    s.includes("add_drone_dialog") ||
    s.includes("account_binding") ||
    s.includes("preflight_checklist") ||
    a.includes("popover") ||
    a.includes("dialog")
  );
}

/** Dense data-table screenshots (failsafe policies, admin tables) need the
 * extra width — they were previously squeezed into half-width table cells. */
function isDenseScreenshot(src) {
  const s = (src || "").toLowerCase();
  return s.includes("failsafe_policies_") || s.includes("admin_page_");
}

function MarkdownImage({ src, alt }) {
  const { open } = useLightbox();
  const [loaded, setLoaded] = useState(false);
  const finalSrc = src?.startsWith("/") ? BASE + src : src;
  const compact = isCompactScreenshot(src, alt);
  const dense = isDenseScreenshot(src);
  const sizeClass = compact ? " docs-image-figure--sm" : dense ? " docs-image-figure--lg" : "";
  return (
    <figure className={`docs-image-figure${sizeClass}`}>
      <button
        type="button"
        className="docs-image-frame docs-image-frame--clickable"
        onClick={() => open(finalSrc, alt)}
        aria-label={`Expand image: ${alt || "PolarisGCS screenshot"}`}
      >
        {!loaded && (
          <div className="docs-image-loading" aria-hidden="true">
            <span className="docs-image-spinner" />
          </div>
        )}
        <img
          src={finalSrc}
          alt={alt || "PolarisGCS screenshot"}
          loading="lazy"
          fetchPriority="high"
          className={`docs-image${loaded ? " is-loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        <span className="docs-image-frame__zoom" aria-hidden="true">⤢</span>
      </button>
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}

function MarkdownTable({ children }) {
  return (
    <div className="docs-table-wrap">
      <table>{children}</table>
    </div>
  );
}

function MarkdownBlockquote({ children }) {
  return <blockquote className="docs-blockquote">{children}</blockquote>;
}

/** react-markdown already wraps fenced code in its own <pre> (AST is
 * `pre > code`) — returning another <pre> here would nest them. The `pre`
 * override below owns the block-level box; this only decides inline vs. block
 * styling for the <code> itself. */
function CodeBlock({ className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const codeText = String(children).replace(/\n$/, "");
  const isBlock = Boolean(match) || codeText.includes("\n");

  if (!isBlock) {
    return (
      <code className="docs-inline-code" {...props}>
        {children}
      </code>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function MarkdownPre({ children }) {
  return <pre className="docs-code-block">{children}</pre>;
}

/** Hoisted so ReactMarkdown gets a stable components map across renders. */
const markdownComponents = {
  img: MarkdownImage,
  table: MarkdownTable,
  blockquote: MarkdownBlockquote,
  pre: MarkdownPre,
  code: CodeBlock,
};

export default function DocsPage({ doc }) {
  const showDeepDives = doc.slug === "upcoming-features" || doc.slug === "overview";

  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-page__eyebrow">Documentation</p>
        <h1>{doc.title}</h1>
        <p className="docs-page__tagline">{doc.tagline}</p>
      </header>

      <div className="docs-markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {doc.content}
        </ReactMarkdown>
      </div>

      {showDeepDives && (
        <section className="docs-deepdive">
          <h2>Deep dives</h2>
          <div className="docs-cards">
            {docs
              .filter((d) => d.slug !== doc.slug)
              .map((d) => (
                <Link
                  key={d.slug}
                  to={d.slug === "upcoming-features" ? "/docs" : `/docs/${d.slug}`}
                  className="docs-card"
                >
                  <span className="docs-card__title">{d.title}</span>
                  <span className="docs-card__tagline">{d.tagline}</span>
                  <span className="docs-card__arrow" aria-hidden="true">→</span>
                </Link>
              ))}
          </div>
        </section>
      )}
    </article>
  );
}
