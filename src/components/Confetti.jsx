import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#4285f4", "#fbbc05", "#ea4335", "#34a853", "#a142f4"];

function makeDots(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 3 + Math.random() * 4,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 6,
  }));
}

export default function Confetti({ count = 26 }) {
  const dots = useMemo(() => makeDots(count), [count]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.span
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background: dot.color,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], opacity: [0.5, 1, 0.5] }
          }
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
