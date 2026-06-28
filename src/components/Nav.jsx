import { brand, nav } from "../data/content";

export default function Nav() {
  return (
    <header className="nav">
      <div className="brand">
        <span className="mark">{brand.mark}</span>
        <span className="tag">{brand.tag}</span>
      </div>
      <nav className="nav-links">
        {nav.links.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <button className="nav-cta">{nav.cta}</button>
    </header>
  );
}
