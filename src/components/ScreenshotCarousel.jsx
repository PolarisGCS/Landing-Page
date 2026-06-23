import { useRef } from "react";
import { motion } from "framer-motion";
import Starfield from "./Starfield";

const SLIDES = [
  { label: "Fleet Overview", note: "All drones, one view", gradient: "from-blue-500 via-cyan-400 to-emerald-400" },
  { label: "Live Map", note: "Real-time position tracking", gradient: "from-amber-400 via-orange-500 to-rose-500" },
  { label: "Mission Planner", note: "Assign and upload flight plans", gradient: "from-violet-500 via-fuchsia-500 to-pink-500" },
  { label: "Telemetry Detail", note: "Deep dive into a single drone", gradient: "from-emerald-400 via-teal-400 to-blue-500" },
];

export default function ScreenshotCarousel() {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#0b0b0d] py-28">
      <Starfield />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-medium text-white sm:text-4xl">
            See it in action
          </h2>
          <div className="flex gap-2">
            <button
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {SLIDES.map((slide, i) => (
            <motion.div
              key={slide.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ scrollSnapAlign: "start" }}
              className="min-w-[280px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div
                className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${slide.gradient}`}
              />
              <div className="p-4">
                <h3 className="font-medium text-white">{slide.label}</h3>
                <p className="mt-1 text-sm text-white/50">{slide.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
