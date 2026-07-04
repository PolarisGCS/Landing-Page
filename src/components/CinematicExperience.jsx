import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import Hud from "./Hud";
import StatLine from "./StatLine";
import Terminal from "./Terminal";
import Background from "./Background";
import Drone from "./Drone";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { bands } from "../data/content";
import { framesAlreadyLoaded } from "../lib/frameCache";

/** Scroll distance — taller track = slower, smoother scrub across the video. */
const TRACK_VH = 1000;

/** How long each CLI chapter stays up before auto-advancing (ms). */
const AUTO_MS = 6500;

/** Derive instrument readouts from scroll progress (0..1).
 *  These track the DRONE's flight as the background video scrubs — they belong
 *  to the scroll-driven scene (background + drone), not to the CLI carousel. */
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
  const hintRef = useRef(null);

  const reduce = useReducedMotion();

  // ── Frame gate: while the 480 background frames are still downloading,
  // Background holds a single static frame and Drone stays grounded (idle
  // props only) instead of scrubbing/lifting off a partially loaded sequence.
  // A side widget shows progress; the user can Skip to fly on partial frames
  // (Background gracefully falls back to the nearest loaded frame already).
  const [pct, setPct] = useState(() => (framesAlreadyLoaded() ? 100 : 0));
  const [ready, setReady] = useState(framesAlreadyLoaded);
  const [skipped, setSkipped] = useState(false);
  const [showCalib, setShowCalib] = useState(() => !framesAlreadyLoaded());
  const unlocked = ready || skipped;

  const handleProgress = useCallback((loaded, total) => {
    setPct(Math.round((loaded / total) * 100));
    if (loaded >= total) setReady(true);
  }, []);
  const handleSkip = useCallback(() => setSkipped(true), []);

  useEffect(() => {
    if (!unlocked || !showCalib) return;
    const id = setTimeout(() => setShowCalib(false), 500);
    return () => clearTimeout(id);
  }, [unlocked, showCalib]);

  // ── CLI carousel: self-paced, independent of scroll ──────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const select = useCallback((idx) => {
    setActiveIndex(((idx % bands.length) + bands.length) % bands.length);
  }, []);
  const next = useCallback(() => select(activeIndex + 1), [activeIndex, select]);
  const prev = useCallback(() => select(activeIndex - 1), [activeIndex, select]);

  // auto-advance; the timer restarts whenever the slide changes or we (un)pause,
  // so a manual jump never collides with a pending tick.
  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % bands.length);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [activeIndex, paused, reduce]);

  // ── Hash listener: jump to chapter when navbar links are clicked ──────
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      if (h === "#fleet") select(1);
      else if (h === "#telemetry") select(2);
      else if (h === "#missions") select(3);
      else if (h === "#docs") select(5);
      else if (h === "#deploy") select(7);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [select]);

  // Read via ref so this loop doesn't need to restart when `unlocked` flips.
  const unlockedRef = useRef(unlocked);
  useEffect(() => {
    unlockedRef.current = unlocked;
  }, [unlocked]);

  // ── Scroll loop: ONLY the background-video / drone-flight chrome ──────
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

    const frame = () => {
      // While frames are still loading the drone stays grounded, so the HUD
      // readout (alt/mode/batt) and progress chrome must stay grounded too —
      // otherwise the instruments would read "climbing" over a still-parked drone.
      const target = unlockedRef.current ? pTarget : 0;
      p += (target - p) * (reduce ? 0.3 : 0.11);

      // push flight telemetry to the stat line (no React state)
      statRef.current?.set(telemetryFor(p));

      // scroll-progress chrome
      if (pathRef.current) pathRef.current.style.width = `${p * 100}%`;
      if (hintRef.current) hintRef.current.style.opacity = p < 0.04 ? "1" : "0";

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
      {showCalib && (
        <div
          className={`calib${unlocked ? " calib--done" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="calib__label">CALIBRATING FLIGHT</div>
          <div className="calib__bar">
            <div className="calib__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="calib__row">
            <span className="calib__pct">{pct}%</span>
            <button type="button" className="calib__skip" onClick={handleSkip}>
              Skip
            </button>
          </div>
          <div className="calib__note">The drone starts flying after calibration!</div>
        </div>
      )}

      <Background reducedMotion={reduce} onProgress={handleProgress} skip={unlocked} />
      <Drone reducedMotion={reduce} locked={!unlocked} />
      <div className="overlay" />
      <div className="pathbar" ref={pathRef} />

      <Nav />
      <Hud ref={hudRef} />
      <StatLine ref={statRef} />
      <Terminal
        activeIndex={activeIndex}
        total={bands.length}
        paused={paused}
        autoMs={AUTO_MS}
        onPrev={prev}
        onNext={next}
        onSelect={select}
        onHoverChange={setPaused}
        onTogglePause={() => setPaused((v) => !v)}
      />

      <div className="hint" ref={hintRef}>
        <span>SCROLL TO TAKE OFF</span>
        <span className="ar" />
      </div>

      {/* tall invisible track produces the scroll distance for the video + drone */}
      <div className="track" style={{ height: `${TRACK_VH}vh` }} aria-hidden="true" />
    </>
  );
}
