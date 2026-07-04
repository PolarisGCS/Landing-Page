import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import CinematicExperience from "./components/CinematicExperience";
import ProductsPage from "./components/ProductsPage";
import DocsApp from "./docs/DocsApp";

function MainContent() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash === "#products" || hash === "#/products" || hash === "#deploy" || hash === "#/deploy") {
    return <ProductsPage />;
  }

  return <CinematicExperience />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/deploy" element={<ProductsPage />} />
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </HashRouter>
  );
}
