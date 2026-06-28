import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const STEPS = [
  "init gcs.core",
  "connect cloud backend",
  "subscribe telemetry bus",
  "fleet discovery",
  "console ready",
];

/** Boot-up checklist that ticks through and confirms each subsystem. */
export default function BootSequence({ caption = "session / online" }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(() => (reduce ? STEPS.length : 0));

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setN((prev) => (prev >= STEPS.length ? prev : prev + 1));
    }, 360);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="feed">
        {STEPS.map((s, i) => (
          <div className="ln" key={s} style={{ opacity: i < n ? 1 : 0.25, transition: "opacity .25s" }}>
            <span style={{ color: i < n ? "var(--signal)" : "var(--hud-dim)" }}>
              {i < n ? "✓" : "·"}
            </span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
