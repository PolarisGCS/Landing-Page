import { motion } from "framer-motion";

const PLATFORMS = [
  {
    name: "Web Dashboard",
    tagline: "Runs in any modern browser. Nothing to install.",
    cta: "Launch Dashboard",
    meta: "Always up to date",
    detail: "No download required — works on any OS with a modern browser.",
    primary: true,
  },
  {
    name: "Desktop Companion App",
    tagline: "Connect and manage multiple drones from one machine.",
    cta: "Download for Windows",
    meta: "v2.4.1 · 86 MB",
    detail: "SHA-256 checksum available · Requires Windows 10 or later",
    primary: false,
  },
  {
    name: "Mobile Companion App",
    tagline: "Connect a single drone per device, built for field use.",
    cta: "Download for Android",
    meta: "v2.4.0 · 41 MB",
    detail: "SHA-256 checksum available · Requires Android 10 or later",
    primary: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PlatformDownloads() {
  return (
    <section id="platforms" className="bg-[#f8f9fc] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-medium text-[#121317] sm:text-5xl">
            Available everywhere
          </h2>
          <p className="mt-4 text-lg text-[#45474d]">
            Pick the way you want to connect to your fleet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLATFORMS.map((p) => (
            <motion.div
              key={p.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative flex flex-col rounded-2xl border border-black/5 bg-white p-6"
            >
              <h3 className="text-lg font-medium text-[#121317]">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-[#45474d]">
                {p.tagline}
              </p>
              <p className="mt-4 text-xs text-[#6a6a71]">{p.meta}</p>

              <div className="mt-2 h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:h-auto group-hover:opacity-100">
                <p className="text-xs text-[#4285f4]">{p.detail}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-5 rounded-full px-5 py-2.5 text-sm font-medium ${
                  p.primary
                    ? "bg-[#121317] text-white"
                    : "bg-black/[0.05] text-[#45474d] hover:bg-black/[0.08]"
                }`}
              >
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
