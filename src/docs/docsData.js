const mdFiles = import.meta.glob('../../docs/*.md', { query: '?raw', import: 'default', eager: true });

const getMdContent = (filename) => {
  const key = Object.keys(mdFiles).find((k) => k.endsWith(filename));
  return key ? mdFiles[key] : "";
};

/** Ordered list of every docs page — drives routing and the sidebar nav. */
export const docs = [
  {
    slug: "overview",
    title: "Overview",
    tagline: "One console for a fleet that's part simulated, part real — and treated identically.",
    content: getMdContent("01-overview.md"),
  },
  {
    slug: "architecture",
    title: "Architecture & Data Flow",
    tagline: "How the frontend, backend, and gateways actually talk to each other across distributed networks.",
    content: getMdContent("02-architecture-and-data-flow.md"),
  },
  {
    slug: "gateways",
    title: "Gateways — Desktop & Android",
    tagline: "One shared Python core, two platforms — a PC app for command stations and a mobile phone in your pocket.",
    content: getMdContent("03-gateways-desktop-and-android.md"),
  },
  {
    slug: "fleet-tier-model",
    title: "Fleet & Tier Model",
    tagline: "Two radio tiers, one automatic budgeting system, and up to 27 drones per gateway.",
    content: getMdContent("04-fleet-and-tier-model.md"),
  },
  {
    slug: "missions",
    title: "Mission Planning & Execution",
    tagline: "From an assigned waypoint plan to an armed, autonomous drone executing precision flight paths.",
    content: getMdContent("05-mission-planning-and-execution.md"),
  },
  {
    slug: "telemetry-failsafe",
    title: "Live Telemetry & Failsafe",
    tagline: "What is streamed, how it reaches the dashboard in under 200 milliseconds, and what happens when anomalies occur.",
    content: getMdContent("06-live-telemetry-and-failsafe.md"),
  },
  {
    slug: "simulation",
    title: "Simulation / SITL",
    tagline: "Fly it in simulation before you fly it for real — with zero special-case code across the entire platform.",
    content: getMdContent("07-simulation-and-sitl.md"),
  },
  {
    slug: "access-control",
    title: "Access Control & Admin",
    tagline: "Who can see what today, centralized governance, and where role-based security is headed.",
    content: getMdContent("08-access-control-and-admin.md"),
  },
  {
    slug: "deployment-scale",
    title: "Deployment & Scale",
    tagline: "What is running today, self-hosted Docker orchestration, and the roadmap for enterprise cloud production.",
    content: getMdContent("09-deployment-and-scaling.md"),
  },
];

export const docsBySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));
