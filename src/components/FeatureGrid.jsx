import { motion } from "framer-motion";
import GlowHalo from "./GlowHalo";

const FEATURES = [
  {
    title: "Multi-drone fleet management",
    desc: "Monitor and control every drone in your fleet from a single, unified dashboard. Group drones into missions, operate across teams, and keep every operator on the same page.",
    cta: "Explore fleet management",
  },
  {
    title: "Real-time telemetry & live map",
    desc: "Live position, altitude, and status data streamed straight to your browser, so you always know exactly where every drone is and what it's doing.",
    cta: "See live telemetry",
  },
  {
    title: "Mission planning & launch",
    desc: "Assign missions, upload flight plans, and start operations in a few clicks — no more juggling separate tools for planning and execution.",
    cta: "Plan a mission",
  },
];

const MORE_FEATURES = [
  {
    title: "Role-based team access",
    desc: "Give operators, planners, and observers exactly the access they need.",
  },
  {
    title: "Simulated & live operations",
    desc: "Train on simulated fleets and run live missions through the same workflow.",
  },
  {
    title: "Alerting & status history",
    desc: "Get notified on anomalies and review a full history of fleet activity.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-medium text-[#121317] sm:text-5xl">
            Built for operators, not spreadsheets
          </h2>
          <p className="mt-4 text-lg text-[#45474d]">
            Everything you need to run a fleet — in one place.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center gap-12 sm:flex-row ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 1 ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1"
              >
                <h3 className="text-2xl font-medium text-[#121317] sm:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-4 text-base text-[#45474d]">{f.desc}</p>
                <button className="mt-6 rounded-full bg-black/[0.05] px-5 py-2.5 text-sm font-medium text-[#45474d] transition-colors hover:bg-black/[0.08]">
                  {f.cta}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="relative flex-1"
              >
                <GlowHalo className="opacity-50" />
                <div className="relative aspect-[4/3] rounded-3xl border border-black/5 bg-[#f8f9fc] p-6 shadow-lg">
                  <div className="flex h-full flex-col justify-between rounded-xl border border-black/5 bg-white p-4">
                    <div className="h-2 w-1/3 rounded-full bg-black/10" />
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-10 rounded-lg bg-black/[0.03]"
                        />
                      ))}
                    </div>
                    <div className="h-8 w-1/2 rounded-full bg-black/[0.05]" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-5 border-t border-black/5 pt-16 sm:grid-cols-3">
          {MORE_FEATURES.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-black/[0.02] p-6"
            >
              <h4 className="font-medium text-[#121317]">{f.title}</h4>
              <p className="mt-2 text-sm text-[#45474d]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
