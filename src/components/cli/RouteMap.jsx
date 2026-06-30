import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const PATH = "M14 96 L70 74 L120 84 L182 40 L246 52 L300 22";
const WAYPOINTS = [
  [14, 96], [70, 74], [120, 84], [182, 40], [246, 52], [300, 22],
];

/** Mission route plotted over a grid, drawing in with a tracked marker. */
export default function RouteMap({ caption = "mission / waypoints uploaded" }) {
  const reduce = useReducedMotion();
  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <div className="routemap">
        <svg viewBox="0 0 314 120" width="100%" height="100%" preserveAspectRatio="none">
          {/* geofence */}
          <rect
            x="6" y="8" width="302" height="104"
            fill="none" stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="3 4"
          />
          {/* route */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="var(--hud)"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* waypoints */}
          {WAYPOINTS.map(([x, y], i) => (
            <motion.g
              key={i}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.18 }}
            >
              <rect x={x - 2.5} y={y - 2.5} width="5" height="5" fill="var(--bg)" stroke="var(--signal)" strokeWidth="1" />
            </motion.g>
          ))}
          {/* tracked vehicle */}
          {!reduce && (
            <circle r="3" fill="var(--signal)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path={PATH} />
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
}
