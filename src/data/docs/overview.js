export const overview = {
  slug: "overview",
  title: "Overview",
  tagline: "One console for a fleet that's part simulated, part real — and treated identically.",
  sections: [
    {
      heading: "The problem",
      body: [
        "Running more than a handful of drones from one place is normally a patchwork: a radio for one, a laptop app for another, a spreadsheet for who's flying what. PolarisGCS is a single ground control system built to command an entire fleet — long-range hobbyist drones and industrial WiFi-linked drones alike — from one web dashboard, whether the drones on the other end are physical hardware or a simulated fleet running for testing.",
      ],
    },
    {
      heading: "The product, in four parts",
      body: [
        "PolarisGCS is split into four components that each do one job well:",
      ],
      list: [
        "**Cloud-GCS** — the web dashboard where an operator plans missions, watches live telemetry, and manages the fleet.",
        "**Cloud backend** — the always-on service that stores fleet/mission state and streams live telemetry between gateways and dashboards.",
        "**Gateway apps** — a desktop app and an Android app that each sit next to the radios, speak MAVLink to the drones, and bridge that to the cloud.",
        "**Simulation suite** — spins up simulated drones for development and demos, indistinguishable from real hardware to everything else in the system.",
      ],
    },
    {
      heading: "The two-tier drone model",
      body: [
        "Every drone reaches the cloud the same way — through a gateway, never directly — but drones differ in their radio hardware, which puts them in one of two tiers.",
      ],
      list: [
        "**Tier 2 (hobbyist / RF-only)** — drones share a long-range radio link. The gateway automatically gives one drone per radio group a full telemetry feed and keeps the rest on a lean, safety-only feed, rebalancing live as drones join or leave.",
        "**Tier 1 (industrial WiFi)** — drones carry a separate high-bandwidth WiFi link for rich sensor payloads (video, LiDAR, thermal), alongside a lightweight safety-only radio link.",
      ],
    },
    {
      heading: "Two ways a drone enters the system",
      body: [
        "A drone is either a **behavior drone** — it starts flying a preset pattern (circle, hover, patrol) the moment it's created, useful for demos and load-testing the fleet view — or a **mission drone** — it's reserved first and only starts flying once an operator assigns it a real mission from the dashboard, at which point it takes off from the mission's planned coordinates.",
      ],
    },
    {
      heading: "Where to go next",
      body: [
        "This overview is the fast version. Each area below has its own deep dive with more detail on how it actually works.",
      ],
    },
  ],
};
