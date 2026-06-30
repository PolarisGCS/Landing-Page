import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LINES = [
  { lvl: "info", c: "var(--signal)", m: "telemetry.sync ok · 0 dropped" },
  { lvl: "warn", c: "var(--warn)", m: "D-07 battery 23% · RTL advised" },
  { lvl: "note", c: "var(--hud)", m: "geofence breach cleared" },
  { lvl: "info", c: "var(--signal)", m: "mission DELTA uploaded → 6 wp" },
  { lvl: "warn", c: "var(--warn)", m: "link loss D-03 · failsafe armed" },
  { lvl: "info", c: "var(--signal)", m: "D-03 reconnected · resume AUTO" },
];

const stamp = (i) => {
  const s = 14 + i * 3;
  return `00:0${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Streaming alert / status feed that prints lines in sequence. */
export default function LogFeed({ caption = "alerts / status history" }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(() => (reduce ? LINES.length : 1));

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setN((prev) => (prev >= LINES.length ? prev : prev + 1));
    }, 480);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="feed">
        {LINES.slice(0, n).map((l, i) => (
          <div className="ln" key={i} style={{ opacity: 1 }}>
            <span className="t">[{stamp(i)}]</span>
            <span style={{ color: l.c, fontWeight: 700 }}>
              {l.lvl.toUpperCase()}
            </span>
            <span>{l.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
