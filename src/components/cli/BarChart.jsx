import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Horizontal bar chart with bars that grow and numbers that count up.
 * `rows`: [{ label, value, suffix, max }]
 */
export default function BarChart({ caption = "metrics", rows }) {
  const [mounted, setMounted] = useState(false);
  const numRefs = useRef([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stops = [];
    rows.forEach((r, i) => {
      const el = numRefs.current[i];
      if (!el) return;
      const decimals = r.value % 1 !== 0 ? 1 : 0;
      if (reduce) {
        el.textContent = r.value.toLocaleString() + (r.suffix || "");
        return;
      }
      const start = performance.now();
      const dur = 1100;
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        const v = r.value * e;
        el.textContent =
          (decimals ? v.toFixed(1) : Math.round(v).toLocaleString()) +
          (r.suffix || "");
        if (t < 1) stops[i] = requestAnimationFrame(step);
      };
      stops[i] = requestAnimationFrame(step);
    });
    return () => stops.forEach((s) => s && cancelAnimationFrame(s));
  }, [mounted, rows, reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="bars">
        {rows.map((r, i) => (
          <div className="barrow" key={r.label}>
            <span className="lab">{r.label}</span>
            <span className="track2">
              <span
                className="fill"
                style={{
                  width: mounted
                    ? `${Math.min(100, (r.value / r.max) * 100)}%`
                    : "0%",
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
            <span className="num" ref={(el) => (numRefs.current[i] = el)}>
              0{r.suffix || ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
