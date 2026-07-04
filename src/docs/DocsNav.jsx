import { NavLink } from "react-router-dom";
import { docs } from "./docsData";

export default function DocsNav() {
  return (
    <nav className="docs-nav" aria-label="Docs pages">
      {docs.map((d) => (
        <NavLink
          key={d.slug}
          to={d.slug === "overview" ? "/docs" : `/docs/${d.slug}`}
          end={d.slug === "overview"}
          className={({ isActive }) =>
            "docs-nav__link" + (isActive ? " is-active" : "")
          }
        >
          {d.title}
        </NavLink>
      ))}
    </nav>
  );
}
