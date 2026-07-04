import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { platforms } from "../../data/content";

const GLYPH = ["◐", "▣", "▤"];

/** Deploy targets (web / desktop / mobile) with link-up progress bars. */
export default function DeployTargets({ caption = "products / available targets" }) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="targets">
        {platforms.items.map((p, i) => (
          <div className="tg" key={p.name}>
            <span style={{ color: "var(--hud)" }}>{GLYPH[i]}</span>
            <div>
              <div className="name">{p.name}</div>
              <div className="meta">{p.meta}</div>
            </div>
            <div style={{ width: 70 }}>
              <span className="track2" style={{ display: "block" }}>
                <span
                  className="fill"
                  style={{
                    width: reduce || mounted ? "100%" : "0%",
                    transitionDelay: `${i * 140}ms`,
                  }}
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
