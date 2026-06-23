import { motion } from "framer-motion";

const STEPS = [
  { title: "Connect", desc: "Register your drone and connect it from the companion app." },
  { title: "Plan", desc: "Assign a mission and upload the flight plan from the dashboard." },
  { title: "Fly", desc: "Launch the mission and track it live, start to finish." },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium text-[#121317] sm:text-5xl">
            How it works
          </h2>
        </div>

        <div className="relative">
          <svg
            className="absolute left-0 top-7 hidden w-full sm:block"
            height="2"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="16"
              y1="0.5"
              x2="84"
              y2="0.5"
              stroke="#121317"
              strokeOpacity="0.15"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-medium text-[#121317] shadow-sm">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-medium text-[#121317]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[#45474d]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
