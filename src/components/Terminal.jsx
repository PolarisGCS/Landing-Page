import { useEffect, useMemo, useRef } from "react";
import { bands, pipelines, metrics } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import BootSequence from "./cli/BootSequence";
import FleetGrid from "./cli/FleetGrid";
import Sparkline from "./cli/Sparkline";
import RouteMap from "./cli/RouteMap";
import Pipeline from "./cli/Pipeline";
import AccessMatrix from "./cli/AccessMatrix";
import LogFeed from "./cli/LogFeed";
import DeployTargets from "./cli/DeployTargets";
import BarChart from "./cli/BarChart";

const LEVEL_LABEL = { info: "INFO", notice: "NOTE", warn: "WARN" };

function Graphic({ kind }) {
  switch (kind) {
    case "boot":
      return <BootSequence />;
    case "fleet":
      return <FleetGrid />;
    case "spark":
      return <Sparkline />;
    case "route":
      return <RouteMap />;
    case "pipeline-sim":
      return <Pipeline caption="sim / parity with live" stages={pipelines.sim} />;
    case "access":
      return <AccessMatrix />;
    case "feed":
      return <LogFeed />;
    case "deploy":
      return <DeployTargets />;
    case "metrics":
      return <BarChart caption="metrics / fleet at scale" rows={metrics} />;
    case "command":
      return <Pipeline caption="workflow / connect → fly" stages={pipelines.command} />;
    default:
      return null;
  }
}

const stampWithMs = () => {
  const d = new Date();
  const p2 = (n) => String(n).padStart(2, "0");
  return `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}.${String(
    d.getMilliseconds(),
  ).padStart(3, "0")}`;
};

/** One active band: log header → title lines → comment → graphic. */
function Band({ band, isFirst }) {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const ts = useMemo(() => stampWithMs(), []);
  const HeadingTag = isFirst ? "h1" : "h2";

  // print-reveal the header + title lines in quick succession
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll(".reveal-line");
    if (reduce) {
      items.forEach((el) => el.classList.add("show"));
      return;
    }
    const timers = [];
    items.forEach((el, i) => {
      el.classList.remove("show");
      timers.push(setTimeout(() => el.classList.add("show"), 60 + i * 80));
    });
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  return (
    <section className="band" ref={rootRef}>
      <div className="logmeta reveal-line">
        <span className="lt">[{ts}]</span>
        <span className={`lvl lvl-${band.level}`}>{LEVEL_LABEL[band.level]}</span>
        <span className="chan">{band.channel}</span>
      </div>

      <HeadingTag>
        {band.lines.map((line, i) => (
          <span key={i}>
            <span className="reveal-line" style={{ display: "inline-block" }}>
              {line}
            </span>
            {i < band.lines.length - 1 && <br />}
          </span>
        ))}
      </HeadingTag>

      {band.comment && <p className="comment reveal-line">{band.comment}</p>}

      <Graphic kind={band.graphic} />
    </section>
  );
}

export default function Terminal({
  activeIndex,
  total,
  paused,
  autoMs,
  onPrev,
  onNext,
  onSelect,
  onHoverChange,
  onTogglePause,
}) {
  const reduce = useReducedMotion();
  const band = bands[Math.min(activeIndex, bands.length - 1)];
  const frac = `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const autoRunning = !paused && !reduce;

  return (
    <div
      className="term"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="term-bar">
        <span className="term-dot r" />
        <span className="term-dot y" />
        <span className="term-dot g" />
        <span className="term-live">
          <span className="dot" />
          <span>LIVE</span>
        </span>
        <span className="term-path">tail -f /var/log/polaris/telemetry.log</span>
        <span className="term-frac">{frac}</span>
      </div>

      <div className="term-body">
        {/* key forces a remount per band so its animations replay */}
        <Band band={band} isFirst={activeIndex === 0} key={activeIndex} />
      </div>

      {/* manual carousel controls — natural footer inside the console */}
      <div className="term-foot">
        <button
          type="button"
          className="tctl"
          onClick={onPrev}
          aria-label="Previous chapter"
        >
          ‹
        </button>

        <button
          type="button"
          className="tctl tctl--play"
          onClick={onTogglePause}
          aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
          aria-pressed={paused}
        >
          {paused ? "▷" : "❙❙"}
        </button>

        <div className="term-dots" role="tablist" aria-label="Chapters">
          {Array.from({ length: total }).map((_, i) => (
            <button
              type="button"
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Chapter ${i + 1}`}
              className={`tdot${i === activeIndex ? " on" : ""}`}
              onClick={() => onSelect(i)}
            >
              {/* fresh mount on each active slide restarts the fill animation */}
              {i === activeIndex && autoRunning && (
                <span
                  className="tdot__bar"
                  style={{ animationDuration: `${autoMs}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="tctl"
          onClick={onNext}
          aria-label="Next chapter"
        >
          ›
        </button>
      </div>
    </div>
  );
}
