import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/** Sequential pipeline whose stages light up one after another. */
export default function Pipeline({ caption = "workflow", stages }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(() => (reduce ? stages.length - 1 : -1));

  useEffect(() => {
    if (reduce) return;
    let i = -1;
    const id = setInterval(() => {
      i += 1;
      setActive(i);
      if (i >= stages.length - 1) clearInterval(id);
    }, 520);
    return () => clearInterval(id);
  }, [stages.length, reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="pipe">
        {stages.map((s, i) => (
          <div key={s.k} style={{ display: "contents" }}>
            {i > 0 && <span className="arrow">{i <= active ? "▶" : "·"}</span>}
            <div
              className="stage"
              style={{
                borderColor: i <= active ? "var(--line)" : "var(--line-soft)",
                opacity: i <= active ? 1 : 0.45,
                transition: "opacity .35s ease, border-color .35s ease",
              }}
            >
              <div className="k">{s.k}</div>
              <div className="v">{s.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
