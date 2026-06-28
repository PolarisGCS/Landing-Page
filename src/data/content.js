/**
 * Single source of truth for the console experience.
 * Copy is derived from the original PolarisGCS site — tightened for the
 * terminal format ("less text, more animation") while keeping the meaning.
 *
 * Each band is one scroll chapter shown inside the CLI. `graphic` names a
 * CLI visual (resolved in Terminal.jsx). `at` is the scroll progress (0..1)
 * at which the band becomes active.
 */

export const brand = { mark: "PolarisGCS", tag: "GROUND CONTROL" };

export const nav = {
  links: [
    { label: "Fleet", href: "#" },
    { label: "Telemetry", href: "#" },
    { label: "Missions", href: "#" },
    { label: "Deploy", href: "#" },
  ],
  cta: "Launch console",
};

/** Platforms — consumed by the DeployTargets CLI graphic. */
export const platforms = {
  items: [
    { name: "Web Dashboard", meta: "no install · any browser" },
    { name: "Desktop Companion", meta: "v2.4.1 · windows 10+" },
    { name: "Mobile Companion", meta: "v2.4.0 · android 10+" },
  ],
};

export const bands = [
  {
    at: 0.0,
    channel: "gcs.session",
    level: "info",
    lines: ["Command your fleet.", "From one screen."],
    comment: "fixed-wing · multirotor · VTOL",
    graphic: "boot",
  },
  {
    at: 0.1,
    channel: "gcs.fleet",
    level: "info",
    lines: ["One screen.", "Every drone."],
    comment: "group · operate · monitor across teams",
    graphic: "fleet",
  },
  {
    at: 0.21,
    channel: "gcs.telemetry",
    level: "info",
    lines: ["Every packet,", "the moment it lands."],
    comment: "position · altitude · status · sub-second",
    graphic: "spark",
  },
  {
    at: 0.33,
    channel: "gcs.mission",
    level: "notice",
    lines: ["Draw the route.", "It flies the route."],
    comment: "waypoints → geofence → upload → AUTO",
    graphic: "route",
  },
  {
    at: 0.45,
    channel: "gcs.sim",
    level: "info",
    lines: ["Fly it before", "you fly it."],
    comment: "ArduPilot SITL · same console, same workflow",
    graphic: "pipeline-sim",
  },
  {
    at: 0.56,
    channel: "gcs.access",
    level: "notice",
    lines: ["Right access.", "Right people."],
    comment: "operators · planners · observers",
    graphic: "access",
  },
  {
    at: 0.67,
    channel: "gcs.failsafe",
    level: "warn",
    lines: ["It tells you first.", "It knows the way home."],
    comment: "anomaly alerts · full status history · auto RTL",
    graphic: "feed",
  },
  {
    at: 0.78,
    channel: "gcs.deploy",
    level: "info",
    lines: ["Run it anywhere."],
    comment: "web · desktop · mobile companion",
    graphic: "deploy",
  },
  {
    at: 0.88,
    channel: "gcs.metrics",
    level: "info",
    lines: ["Built for scale."],
    comment: "from a handful of trainers to multi-team ops",
    graphic: "metrics",
  },
  {
    at: 0.96,
    channel: "gcs.command",
    level: "notice",
    lines: ["Take command."],
    comment: "connect in under 5 minutes",
    graphic: "command",
    cta: { primary: "Launch console", ghost: "Read the docs" },
  },
];

/** Pipelines used by pipeline-style graphics. */
export const pipelines = {
  sim: [
    { k: "SIM", v: "spin up SITL" },
    { k: "PLAN", v: "same console" },
    { k: "LIVE", v: "identical workflow" },
  ],
  command: [
    { k: "CONNECT", v: "register + link drone" },
    { k: "PLAN", v: "assign + upload" },
    { k: "FLY", v: "launch · track live" },
  ],
};

/** Stats — consumed by the metrics BarChart graphic. */
export const metrics = [
  { label: "drones managed", value: 1280, suffix: "+", max: 1400 },
  { label: "missions flown", value: 342, suffix: "", max: 1400 },
  { label: "uptime", value: 99.9, suffix: "%", max: 100 },
  { label: "live monitoring", value: 24, suffix: "/7", max: 24 },
];
