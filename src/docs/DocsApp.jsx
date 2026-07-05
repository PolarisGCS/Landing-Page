import { Routes, Route } from "react-router-dom";
import DocsLayout from "./DocsLayout";
import DocsPage from "./DocsPage";
import { docs, docsBySlug } from "./docsData";

export default function DocsApp() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<DocsPage doc={docsBySlug["upcoming-features"]} />} />
        {docs
          .filter((d) => d.slug !== "upcoming-features")
          .map((d) => (
            <Route
              key={d.slug}
              path={d.slug}
              element={<DocsPage doc={d} />}
            />
          ))}
      </Route>
    </Routes>
  );
}
