import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import Hud from "./Hud";
import StatLine from "./StatLine";
import Terminal from "./Terminal";
import Background from "./Background";
import Drone from "./Drone";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { bands } from "../data/content";

/** Scroll distance — taller track = slower, smoother scrub across bands. */
const TRACK_VH = 1000;

/** Derive instrument readouts from scroll progress (0..1). */
const ALT_MAX = 420;
const MODES = [
  { at: 0.0, t: "STABILIZE" },
  { at: 0.05, t: "TAKEOFF" },
  { at: 0.3, t: "GUIDED" },
  { at: 0.6, t: "AUTO" },
  { at: 0.85, t: "LOITER" },
];
function telemetryFor(p) {
  let mode = MODES[0].t;
  for (const m of MODES) if (p >= m.at) mode = m.t;
  return { mode, alt: p * ALT_MAX, batt: Math.max(60, 100 - p * 16) };
}

export default function CinematicExperience() {
  const hudRef = useRef(null);
  const statRef = useRef(null);
  const pathRef = useRef(null);
  const fracRef = useRef(null);
  const hintRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let pTarget = 0;
    let p = 0;
    let raf;

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      pTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const onMouseMove = (e) => {
      const hud = hudRef.current;
      if (!hud) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      hud.style.transform = `translate(${mx * 7}px, ${my * 7}px)`;
    };

    const pickBand = (prog) => {
      let idx = 0;
      for (let i = 0; i < bands.length; i++) {
        if (prog >= bands[i].at - 0.001) idx = i;
      }
      return idx;
    };

    const frame = () => {
      p += (pTarget - p) * (reduce ? 0.3 : 0.11);

      // push telemetry to the stat line (no React state)
      statRef.current?.set(telemetryFor(p));

      // chrome updates via refs
      if (pathRef.current) pathRef.current.style.width = `${p * 100}%`;
      if (hintRef.current) hintRef.current.style.opacity = p < 0.04 ? "1" : "0";
      if (fracRef.current) {
        const n = pickBand(p) + 1;
        fracRef.current.textContent = `${String(n).padStart(2, "0")} / ${String(bands.length).padStart(2, "0")}`;
      }

      // swap active band only when it changes
      const idx = pickBand(p);
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }

      raf = requestAnimationFrame(frame);
    };

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    if (!reduce) window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [reduce]);

  return (
    <>
      <Background reducedMotion={reduce} />
      <Drone reducedMotion={reduce} />
      <div className="overlay" />
      <div className="pathbar" ref={pathRef} />

      <Nav />
      <Hud ref={hudRef} />
      <StatLine ref={statRef} />
      <Terminal activeIndex={activeIndex} fracRef={fracRef} />

      <div className="hint" ref={hintRef}>
        <span>SCROLL TO TAKE OFF</span>
        <span className="ar" />
      </div>

      {/* tall invisible track produces the scroll distance */}
      <div className="track" style={{ height: `${TRACK_VH}vh` }} aria-hidden="true" />
    </>
  );
}
