import { useState } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  {
    q: "What platforms are supported?",
    a: "PolarisGCS runs as a web dashboard in any modern browser, with a desktop companion app for Windows and a mobile companion app for Android.",
  },
  {
    q: "Can I run simulated drones for training?",
    a: "Yes. Simulated and live drones run through the exact same workflow, so training and field operations feel identical.",
  },
  {
    q: "How many drones can I manage at once?",
    a: "The dashboard is built for fleets of any size, from a handful of training drones to large multi-team operations.",
  },
  {
    q: "Is there a free tier?",
    a: "Reach out to our team to find the plan that fits your fleet size and operational needs.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/10 py-5">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-[#121317]">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#6a6a71]"
        >
          ▾
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pt-3 text-sm text-[#45474d]">{a}</p>
      </motion.div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-medium text-[#121317] sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div>
          {ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
