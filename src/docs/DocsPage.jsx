import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docs } from "./docsData";

export default function DocsPage({ doc }) {
  const isOverview = doc.slug === "overview";

  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <h1>{doc.title}</h1>
        <p className="docs-page__tagline">{doc.tagline}</p>
      </header>

      <div className="docs-markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => {
              const base = import.meta.env.BASE_URL || "/";
              const finalSrc = src?.startsWith("/")
                ? base.replace(/\/$/, "") + src
                : src;
              return (
                <figure className="docs-image-figure my-8">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-md transition-transform duration-300 hover:border-slate-300">
                    <img
                      src={finalSrc}
                      alt={alt || "PolarisGCS Screenshot"}
                      className="w-full h-auto object-cover max-h-[600px]"
                      loading="lazy"
                    />
                  </div>
                  {alt && (
                    <figcaption className="mt-3 text-center text-sm text-slate-500 font-mono tracking-wide">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            },
            table: ({ children }) => (
              <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                {children}
              </td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 border-l-4 border-sky-500 bg-sky-50 px-6 py-4 rounded-r-lg text-slate-700 italic shadow-sm">
                {children}
              </blockquote>
            ),
            code: ({ inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm overflow-x-auto">
                  {match && (
                    <div className="mb-2 text-xs font-mono uppercase text-sky-600 font-bold tracking-wider">
                      {match[1]}
                    </div>
                  )}
                  <pre className="text-sm font-mono text-slate-800 leading-relaxed">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800 border border-slate-200" {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="mt-12 mb-6 text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-10 mb-5 text-2xl font-bold tracking-tight text-slate-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-8 mb-4 text-xl font-semibold text-sky-600">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="my-4 text-slate-700 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="my-4 list-disc pl-6 space-y-2 text-slate-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 list-decimal pl-6 space-y-2 text-slate-700">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>

      {isOverview && (
        <section className="docs-section docs-deepdive-grid mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Deep dives</h2>

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
