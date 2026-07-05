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
            to={d.slug === "upcoming-features" ? "/docs" : `/docs/${d.slug}`}
            end={d.slug === "upcoming-features"}
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

      <div className="docs-sidebar__note">
        <div className="docs-sidebar__note-header">
          <span className="docs-sidebar__note-icon" aria-hidden="true">🚧</span>
          <span>Active Build & Preview</span>
        </div>
        <p className="docs-sidebar__note-body">
          Welcome to PolarisGCS! Our interactive landing website and cloud console are currently in active development and internal testing. We have routed our domain directly to this comprehensive documentation suite so you can review our architecture, gateway specs, and flight capabilities while we finalize regional approvals. Feel free to explore the website—thank you!
        </p>
      </div>
    </aside>
  );
}
