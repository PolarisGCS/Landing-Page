import { motion } from "framer-motion";
import Confetti from "./Confetti";
import GlowHalo from "./GlowHalo";
import { useCountUp } from "../hooks/useCountUp";

const HEADLINE = "Command your entire fleet from one screen";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const word = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function StatCounter({ target, suffix, label }) {
  const [ref, value] = useCountUp(target);
  return (
    <div ref={ref} className="text-left">
      <div className="text-2xl font-medium text-[#121317]">
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-wide text-[#6a6a71]">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-44 pb-28">
      <Confetti />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="text-sm font-medium text-[#6a6a71]">
          PolarisGCS
        </span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto mt-4 max-w-4xl text-[44px] font-medium leading-[1.08] tracking-tight text-[#121317] sm:text-[64px] md:text-[80px]"
        >
          {HEADLINE.split(" ").map((w, i) => (
            <motion.span key={i} variants={word} className="mr-3 inline-block">
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-lg text-[#45474d]"
        >
          Monitor telemetry, plan missions, and launch operations across your
          entire drone fleet from a single, real-time dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#platforms"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-[#121317] px-7 py-3.5 text-sm font-medium text-white"
          >
            Launch Dashboard
          </motion.a>
          <motion.a
            href="#platforms"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-black/[0.05] px-7 py-3.5 text-sm font-medium text-[#45474d] hover:bg-black/[0.08]"
          >
            Explore Platforms
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto mt-20 max-w-3xl"
        >
          <GlowHalo />
          <div className="relative rounded-3xl border border-black/5 bg-[#f8f9fc] p-3 shadow-xl">
            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <span className="text-xs font-medium text-[#6a6a71]">
                  Fleet Overview
                </span>
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-[#6a6a71]">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-4">
                <StatCounter target={1280} suffix="+" label="Drones Managed" />
                <StatCounter target={342} suffix="" label="Missions Flown" />
                <StatCounter target={99} suffix=".9%" label="Uptime" />
                <StatCounter target={24} suffix="/7" label="Live Monitoring" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex h-14 items-center justify-center rounded-xl border border-black/5 bg-black/[0.015]"
                  >
                    <motion.span
                      className="h-2 w-2 rounded-full bg-[#4285f4]"
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
