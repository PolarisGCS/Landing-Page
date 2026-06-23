import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUOTES = [
  {
    text: "We went from juggling three different tools to running our entire training fleet out of one dashboard.",
    author: "Field Operations Lead, robotics research team",
  },
  {
    text: "Mission upload and launch finally feels like a single workflow instead of five manual steps.",
    author: "Drone Program Coordinator",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="relative mx-auto h-40 max-w-3xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <blockquote className="text-xl font-medium text-[#121317]">
              “{QUOTES[index].text}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-[#6a6a71]">
              {QUOTES[index].author}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </section>
  );
}
