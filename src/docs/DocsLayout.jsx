import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import Background from "../components/Background";
import DocsNav from "./DocsNav";
import { LightboxProvider } from "./LightboxContext";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function DocsLayout() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();

  // Switching docs pages swaps <Outlet/> in place — it doesn't reset window
  // scroll on its own, so a reader deep in one page would land mid-scroll
  // on the next one.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="docs-shell">
      <Background reducedMotion={reduce} staticFrame={1} />
      <div className="overlay" />

      <Nav />

      <div className="docs-body">
        <DocsNav />
        <main className="docs-content">
          <LightboxProvider>
            <Outlet />
          </LightboxProvider>
        </main>
      </div>
    </div>
  );
}
