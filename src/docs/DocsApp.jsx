import { Routes, Route } from "react-router-dom";
import DocsLayout from "./DocsLayout";
import DocsPage from "./DocsPage";
import { docs, docsBySlug } from "./docsData";

export default function DocsApp() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<DocsPage doc={docsBySlug.overview} />} />
        {docs
          .filter((d) => d.slug !== "overview")
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
