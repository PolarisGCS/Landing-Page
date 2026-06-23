import { motion } from "framer-motion";
import Starfield from "./Starfield";
import GlowHalo from "./GlowHalo";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0b0b0d] py-32 text-center">
      <Starfield count={120} />
      <div className="relative mx-auto max-w-2xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-medium text-white sm:text-5xl"
        >
          Ready to take control of your fleet?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-10 inline-block"
        >
          <GlowHalo className="opacity-60" />
          <motion.a
            href="#platforms"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-[#121317]"
          >
            Get Started
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
