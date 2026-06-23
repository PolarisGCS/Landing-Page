import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = ["Features", "Platforms", "Docs", "Pricing"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-lg font-medium tracking-tight text-[#121317]">
          Polaris<span className="text-[#4285f4]">GCS</span>
        </span>

        <nav className="hidden items-center gap-1 text-[14.5px] font-medium text-[#45474d] md:flex">
          {LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="rounded-full px-4 py-2 transition-colors hover:bg-black/5 hover:text-[#121317]"
            >
              {label}
            </a>
          ))}
        </nav>

        <motion.a
          href="#platforms"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-[#121317] px-5 py-2.5 text-sm font-medium text-white"
        >
          Get Started
        </motion.a>
      </div>
    </header>
  );
}
