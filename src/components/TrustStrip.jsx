import { motion } from "framer-motion";

const NAMES = ["Aerion Labs", "Helios Robotics", "Northwind Field Ops", "Vantage Systems", "Skyline Dynamics"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TrustStrip() {
  return (
    <section className="border-y border-black/5 bg-[#f8f9fc] py-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6"
      >
        <span className="w-full text-center text-xs uppercase tracking-widest text-[#6a6a71] sm:w-auto">
          Trusted for training, research &amp; field operations
        </span>
        {NAMES.map((name) => (
          <motion.span
            key={name}
            variants={item}
            className="text-sm font-medium text-[#45474d]"
          >
            {name}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
