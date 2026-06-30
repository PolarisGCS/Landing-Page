import { useRef } from "react";
import { useDroneFlight } from "../hooks/useDroneFlight";

/**
 * Stylised quadcopter: the body is the supplied illustration; the propellers
 * are drawn here as vectors (PropellerSVG) so we own their geometry. Each prop
 * is centred on its motor and spun inside a CSS-3D **tilted plane**
 * (rotateX + rotateZ in useDroneFlight) — a real 3D rotation, so the hub stays
 * pinned to the motor and the blades trace the correct ellipse. No flattened
 * raster, no hub-offset guesswork.
 *
 *   Drone scene
 *   ├── Shadow / Rotor wash / Dust   (ground effects)
 *   └── Lift → Shake → Downwash → Hover
 *       └── Body + 4× (tilted spinning Propeller + blur disc)
 */

interface Rotor {
  id: string;
  /** Motor bell-top centre as a % of the body asset (drone_body.png, 500×500). */
  x: number;
  y: number;
}

const ROTORS: Rotor[] = [
  { id: "rear", x: 49.6, y: 21.2 },
  { id: "right", x: 88.8, y: 36.0 },
  { id: "left", x: 11.4, y: 37.2 },
  { id: "front", x: 49.8, y: 54.2 },
];

/** One swept blade (tip to the right of centre); the second is this rotated 180°. */
const BLADE =
  "M100 100 C121 85 156 82 185 92 C194 95 195 105 186 108 C156 118 123 113 100 100 Z";
const SPINE = "M106 99 C132 90 160 89 184 97";

/** Vector propeller — flat, centred on (100,100), white cel-shaded to match the body. */
function PropellerSVG() {
  return (
    <svg className="prop__svg" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#fdfefe" />
          <stop offset="0.55" stopColor="#e7ebf0" />
          <stop offset="1" stopColor="#c3ccd6" />
        </linearGradient>
        <radialGradient id="hubGrad" cx="0.4" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#838b95" />
          <stop offset="0.6" stopColor="#454b53" />
          <stop offset="1" stopColor="#282c32" />
        </radialGradient>
      </defs>

      {/* blades */}
      <g stroke="#1b1e24" strokeWidth="1.4" strokeLinejoin="round" fill="url(#bladeGrad)">
        <path d={BLADE} />
        <path d={BLADE} transform="rotate(180 100 100)" />
      </g>
      {/* spine highlights for a touch of 3D */}
      <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d={SPINE} />
        <path d={SPINE} transform="rotate(180 100 100)" />
      </g>

      {/* central hub seated on the motor */}
      <circle cx="100" cy="100" r="17" fill="url(#hubGrad)" stroke="#15181d" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="9.5" fill="#23272d" stroke="#0e1014" strokeWidth="1" />
      <circle cx="96" cy="96" r="2.4" fill="#6b727b" />
      <circle cx="100" cy="100" r="3" fill="#565c64" />
    </svg>
  );
}

interface DroneProps {
  className?: string;
  reducedMotion?: boolean;
}

export default function Drone({ className = "", reducedMotion = false }: DroneProps) {
  const liftRef = useRef<HTMLDivElement | null>(null);
  const shakeRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const washRef = useRef<HTMLDivElement | null>(null);
  const dustRef = useRef<HTMLDivElement | null>(null);
  const downwashRef = useRef<HTMLDivElement | null>(null);
  const spinRefs = useRef(ROTORS.map(() => ({ current: null as HTMLDivElement | null })));
  const discRefs = useRef(ROTORS.map(() => ({ current: null as HTMLSpanElement | null })));

  useDroneFlight(
    {
      lift: liftRef,
      shake: shakeRef,
      shadow: shadowRef,
      wash: washRef,
      dust: dustRef,
      downwash: downwashRef,
      blades: spinRefs.current,
      discs: discRefs.current,
    },
    reducedMotion,
  );

  return (
    <div className={`drone-scene ${className}`} aria-hidden="true">
      <div className="drone-pos">
        <div className="drone-shadow" ref={shadowRef} />
        <div className="rotorwash" ref={washRef}>
          <span className="rw-ring" />
          <span className="rw-ring" />
          <span className="rw-ring" />
          <span className="rw-ring" />
        </div>
        <div className="dust" ref={dustRef}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="dust__puff" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>

        <div className="drone-lift" ref={liftRef}>
          <div className="drone-shake" ref={shakeRef}>
            <div className="downwash" ref={downwashRef}>
              <span /><span /><span /><span /><span />
            </div>

            <div className={`drone-hover${reducedMotion ? " is-static" : ""}`}>
              <div className="drone-anchor">
                <div className="drone__glow" />
                <img className="drone__body" src="/drone_body.png" alt="" draggable={false} />

                {ROTORS.map((r, i) => (
                  <div
                    key={r.id}
                    className={`prop prop--${r.id}`}
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  >
                    <div className="prop__spin" ref={spinRefs.current[i]}>
                      <PropellerSVG />
                    </div>
                    <span className="prop__disc" ref={discRefs.current[i]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
