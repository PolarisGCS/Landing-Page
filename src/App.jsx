import { useEffect, useState } from "react";
import CinematicExperience from "./components/CinematicExperience";
import ProductsPage from "./components/ProductsPage";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash === "#products" || hash === "#deploy") {
    return <ProductsPage />;
  }

  return <CinematicExperience />;
}
