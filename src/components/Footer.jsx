const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Platforms", "Changelog", "Roadmap"],
  },
  {
    title: "Platforms",
    links: ["Web Dashboard", "Desktop App", "Mobile App"],
  },
  {
    title: "Resources",
    links: ["Docs", "Support", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-[#121317]">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#45474d] transition-colors hover:text-[#121317]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 text-sm text-[#6a6a71] sm:flex-row">
          <span>© {new Date().getFullYear()} PolarisGCS. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#121317]">Twitter</a>
            <a href="#" className="hover:text-[#121317]">GitHub</a>
            <a href="#" className="hover:text-[#121317]">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
