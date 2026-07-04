import { NavLink } from "react-router-dom";
import { docs } from "./docsData";

export default function DocsNav() {
  return (
    <aside className="docs-sidebar">
      <span className="docs-sidebar__label">Documentation</span>
      <nav className="docs-nav" aria-label="Docs pages">
        {docs.map((d, i) => (
          <NavLink
            key={d.slug}
            to={d.slug === "overview" ? "/docs" : `/docs/${d.slug}`}
            end={d.slug === "overview"}
            className={({ isActive }) =>
              "docs-nav__link" +
              (d.pinned ? " docs-nav__link--pinned" : "") +
              (docs[i + 1] && !docs[i + 1].pinned && d.pinned ? " docs-nav__link--pinned-last" : "") +
              (isActive ? " is-active" : "")
            }
          >
            {d.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
