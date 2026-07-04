import { Link, Outlet } from "react-router-dom";
import { brand } from "../data/content";
import DocsNav from "./DocsNav";

export default function DocsLayout() {
  return (
    <div className="docs">
      <header className="docs-header">
        <div className="brand">
          <span className="mark">{brand.mark}</span>
          <span className="tag">{brand.tag}</span>
        </div>
        <Link to="/" className="btn ghost docs-header__back">
          ← Back to site
        </Link>
      </header>
      <div className="docs-body">
        <DocsNav />
        <main className="docs-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
