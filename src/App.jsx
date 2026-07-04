import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import CinematicExperience from "./components/CinematicExperience";
import ProductsPage from "./components/ProductsPage";
import DocsApp from "./docs/DocsApp";

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return hash;
}

/** Hash values that swap an overlay page (Products/Docs) on top of the
 *  persistent home stage below. */
function isOverlayHash(hash) {
  return (
    hash === "#products" ||
    hash === "#/products" ||
    hash === "#deploy" ||
    hash === "#/deploy" ||
    hash.startsWith("#/docs")
  );
}

function MainContent() {
  const hash = useHash();
  if (hash === "#products" || hash === "#/products" || hash === "#deploy" || hash === "#/deploy") {
    return <ProductsPage />;
  }
  // Home itself is rendered permanently by <HomeStage/> — nothing to do here.
  return null;
}

/** Mounted once for the app's whole lifetime. Its 480-frame background and
 *  drone are expensive to warm up (preloaded frames, GSAP flight rig), so
 *  visiting Docs/Products must only hide this — never unmount it — or the
 *  whole sequence reloads and the drone resets when the user comes back. */
function HomeStage() {
  const hash = useHash();
  const visible = !isOverlayHash(hash);

  return (
    <div style={visible ? undefined : { display: "none" }} aria-hidden={!visible}>
      <CinematicExperience />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <HomeStage />
      <Routes>
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/deploy" element={<ProductsPage />} />
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </HashRouter>
  );
}
