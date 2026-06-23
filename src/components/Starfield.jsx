import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

function makeStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 5,
    duration: 2.5 + Math.random() * 3,
  }));
}

export default function Starfield({ count = 90, className = "" }) {
  const stars = useMemo(() => makeStars(count), [count]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.15, 1, 0.15] }
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
