import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const COUNT = 12;

/** Grid of fleet units whose status dots flicker between online/idle/warn. */
export default function FleetGrid({ caption = "fleet / tier-1 + tier-2 online" }) {
  const [states, setStates] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => (i === 4 ? "idle" : "on")),
  );
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setStates((prev) => {
        const next = prev.slice();
        const i = Math.floor(Math.random() * COUNT);
        const roll = Math.random();
        next[i] = roll > 0.9 ? "warn" : roll > 0.78 ? "idle" : "on";
        return next;
      });
    }, 620);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="fleet">
        {states.map((s, i) => (
          <div className="cell" key={i}>
            <span className={`d ${s === "on" ? "dot-on" : s === "warn" ? "dot-warn" : "dot-idle"}`} />
            <span>D-{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
