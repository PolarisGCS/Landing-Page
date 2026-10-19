const mdFiles = import.meta.glob('../../docs/*.md', { query: '?raw', import: 'default', eager: true });

/**
 * The title and tagline are rendered by DocsPage's own header, but every
 * source file repeats both as its own `# Title` + lead paragraph — strip
 * both so they don't print twice.
 */
const getMdContent = (filename, tagline) => {
  const key = Object.keys(mdFiles).find((k) => k.endsWith(filename));
  let content = key ? mdFiles[key] : "";
  content = content.replace(/^#\s+.+\n+/, "");
  if (tagline && content.startsWith(tagline)) {
    content = content.slice(tagline.length).replace(/^\n+/, "");
  }
  return content;
};

/** Ordered list of every docs page — drives routing and the sidebar nav. */
const rawDocs = [
  {
    slug: "upcoming-features",
    title: "🚨 Upcoming Features",
    tagline: "What's next for PolarisGCS, starting with a new module in active development.",
    file: "00-upcoming-features.md",
    pinned: true,
  },
  {
    slug: "overview",
    title: "Overview",
    tagline: "One console for a fleet that's part simulated, part real — and treated identically.",
    file: "01-overview.md",
  },
  {
    slug: "architecture",
    title: "Architecture & Data Flow",
    tagline: "How the frontend, backend, and gateways actually talk to each other across distributed networks.",
    file: "02-architecture-and-data-flow.md",
  },
  {
    slug: "gateways",
    title: "Gateways — Desktop & Android",
    tagline: "One shared Python core, two platforms — a PC app for command stations and a mobile phone in your pocket.",
    file: "03-gateways-desktop-and-android.md",
  },
  {
    slug: "fleet-tier-model",
    title: "Fleet & Tier Model",
    tagline: "Two radio tiers and one automatic rich/critical budgeting system per radio group.",
    file: "04-fleet-and-tier-model.md",
  },
  {
    slug: "missions",
    title: "Mission Planning & Execution",
    tagline: "From an assigned waypoint plan to an armed, autonomous drone executing precision flight paths.",
    file: "05-mission-planning-and-execution.md",
  },
  {
    slug: "telemetry-failsafe",
    title: "Live Telemetry & Failsafe",
    tagline: "What is streamed, how it reaches the dashboard in under 200 milliseconds, and what happens when anomalies occur.",
    file: "06-live-telemetry-and-failsafe.md",
  },
  {
    slug: "simulation",
    title: "Simulation / SITL",
    tagline: "Fly it in simulation before you fly it for real — with zero special-case code across the entire platform.",
    file: "07-simulation-and-sitl.md",
  },
  {
    slug: "access-control",
    title: "Access Control & Admin",
    tagline: "Who can see what today, centralized governance, and where role-based security is headed.",
    file: "08-access-control-and-admin.md",
  },
  {
    slug: "deployment-scale",
    title: "Deployment & Scale",
    tagline: "What is running today, self-hosted Docker orchestration, and the roadmap for enterprise cloud production.",
    file: "09-deployment-and-scaling.md",
  },
];

export const docs = rawDocs.map(({ file, tagline, ...rest }) => ({
  ...rest,
  tagline,
  content: getMdContent(file, tagline),
}));

export const docsBySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));
