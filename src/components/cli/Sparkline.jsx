import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const BARS = 32;

/** Live, scrolling telemetry sparkline drawn from mono bars. */
export default function Sparkline({ caption = "telemetry / live · redis fan-out" }) {
  const refs = useRef([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const bars = refs.current;
    // seed a smooth wave
    let phase = 0;
    const vals = Array.from({ length: BARS }, (_, i) =>
      0.4 + 0.3 * Math.sin(i * 0.5),
    );
    const paint = () => {
      for (let i = 0; i < bars.length; i++) {
        if (bars[i]) bars[i].style.height = `${Math.max(4, vals[i] * 100)}%`;
      }
    };
    if (reduce) {
      paint();
      return;
    }
    let raf;
    let last = 0;
    const tick = (t) => {
      if (t - last > 70) {
        last = t;
        phase += 0.35;
        vals.shift();
        const v =
          0.45 +
          0.32 * Math.sin(phase) +
          0.12 * Math.sin(phase * 2.3) +
          (Math.random() - 0.5) * 0.12;
        vals.push(Math.min(1, Math.max(0.08, v)));
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="spark">
        {Array.from({ length: BARS }).map((_, i) => (
          <i key={i} ref={(el) => (refs.current[i] = el)} />
        ))}
      </div>
    </div>
  );
}
