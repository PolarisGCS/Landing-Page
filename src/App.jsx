import { HashRouter, Routes, Route } from "react-router-dom";
import CinematicExperience from "./components/CinematicExperience";
import DocsApp from "./docs/DocsApp";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/*" element={<CinematicExperience />} />
      </Routes>
    </HashRouter>
  );
}
