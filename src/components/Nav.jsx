import { brand, nav } from "../data/content";

export default function Nav() {
  return (
    <header className="nav">
      <a href="#/home" className="brand" style={{ textDecoration: "none" }}>
        <span className="mark">{brand.mark}</span>
      </a>
      <nav className="nav-links">
        {nav.links.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
