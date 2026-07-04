export const fleetTierModel = {
  slug: "fleet-tier-model",
  title: "Fleet & Tier Model",
  tagline: "Two radio tiers, one automatic budgeting system, up to 27 drones per gateway.",
  sections: [
    {
      heading: "Why tiers exist",
      body: [
        "Not every drone carries the same radio hardware. PolarisGCS groups drones into two tiers based on what link they have back to the gateway — the gateway and cloud treat every drone the same way operationally, but the radio budget math differs.",
      ],
    },
    {
      heading: "Tier 2 — hobbyist / RF-only",
      body: [
        "These drones share a single long-range radio link per group. Rather than asking an operator to manually decide which drone gets the good feed, the gateway automatically promotes as many drones per radio group to a full ('rich') telemetry feed as the shared radio budget allows, and keeps the rest on a lean, safety-critical-only feed — position, altitude, heading, battery, armed state. It recomputes this balance live whenever a drone joins or leaves a group.",
        "The group size is capped in development at 6 drones, a limit driven by radio round-trip latency rather than bandwidth. Four such groups per gateway give a Tier 2 capacity of 24 drones.",
      ],
    },
    {
      heading: "Tier 1 — industrial WiFi",
      body: [
        "These drones carry a second, separate WiFi link purely for high-bandwidth sensor payloads — live video, LiDAR, thermal imagery — alongside the same lightweight safety radio link every drone has. A gateway supports up to 3 Tier 1 drones (limited by WiFi channel contention), plus one designated video drone.",
      ],
    },
    {
      heading: "Combined fleet capacity",
      body: [
        "24 Tier 2 drones + 3 Tier 1 drones + 1 video drone gives a single gateway a combined capacity of up to 27 drones. An operator's account can connect multiple gateways, and the dashboard fans in telemetry and control across all of them into one fleet view.",
      ],
    },
  ],
};
