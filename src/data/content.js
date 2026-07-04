/**
 * Single source of truth for the console experience.
 *
 * Copy is real PolarisGCS product context, condensed for the terminal format
 * ("less text, more animation"). Facts are drawn from the Cloud-GCS SRS,
 * the alignment plan, and the Android gateway playbook.
 *
 * Each band is one chapter shown inside the CLI. The CLI advances on its own
 * (auto carousel + manual controls) — it is NOT driven by scroll. `graphic`
 * names a CLI visual (resolved in Terminal.jsx).
 */

export const brand = { mark: "PolarisGCS", tag: "GROUND CONTROL" };

export const nav = {
  links: [
    { label: "Fleet", href: "#fleet" },
    { label: "Telemetry", href: "#telemetry" },
    { label: "Missions", href: "#missions" },
    { label: "Products", href: "#products" },
    { label: "Docs", href: "#/docs" },
  ],
};

/** Platforms — consumed by the DeployTargets CLI graphic. */
export const platforms = {
  items: [
    { name: "Web Dashboard", meta: "no install · any browser" },
    { name: "Desktop Gateway", meta: "windows · linux · macos" },
    { name: "Android Gateway", meta: "android 8.0+ · one drone / phone" },
  ],
};

export const bands = [
  {
    channel: "gcs.session",
    level: "info",
    lines: ["Command the fleet.", "From the cloud."],
    comment: "multi-drone ground control · web · desktop · mobile",
    graphic: "boot",
  },
  {
    channel: "gcs.fleet",
    level: "info",
    lines: ["Every drone.", "One console."],
    comment: "tier-1 wifi + tier-2 rf · up to 27 drones per gateway",
    graphic: "fleet",
  },
  {
    channel: "gcs.telemetry",
    level: "info",
    lines: ["Live telemetry,", "under 200 ms."],
    comment: "position · attitude · battery · gps · redis fan-out",
    graphic: "spark",
  },
  {
    channel: "gcs.mission",
    level: "notice",
    lines: ["Plan the route.", "It flies the route."],
    comment: "waypoints → geofence → upload → AUTO",
    graphic: "route",
  },
  {
    channel: "gcs.sim",
    level: "info",
    lines: ["Fly it in SITL", "before you fly it."],
    comment: "ardupilot sitl · indistinguishable from real hardware",
    graphic: "pipeline-sim",
  },
  {
    channel: "gcs.access",
    level: "notice",
    lines: ["Right access,", "right people."],
    comment: "operator · planner · observer · admin",
    graphic: "access",
  },
  {
    channel: "gcs.failsafe",
    level: "warn",
    lines: ["It warns first.", "It knows the way home."],
    comment: "anomaly alerts · link-loss failsafe · auto RTL",
    graphic: "feed",
  },
  {
    channel: "gcs.products",
    level: "info",
    lines: ["Explore products,", "run it anywhere."],
    comment: "web dashboard · desktop gateway · android gateway",
    graphic: "deploy",
  },
  {
    channel: "gcs.scale",
    level: "info",
    lines: ["Built to scale."],
    comment: "1000+ concurrent drones · 30-day telemetry history",
    graphic: "metrics",
  },
  {
    channel: "gcs.command",
    level: "notice",
    lines: ["Take command."],
    comment: "connect → plan → fly",
    graphic: "command",
  },
];

/** Pipelines used by pipeline-style graphics. */
export const pipelines = {
  sim: [
    { k: "SITL", v: "spawn ardupilot" },
    { k: "GATEWAY", v: "same mavlink path" },
    { k: "LIVE", v: "identical workflow" },
  ],
  command: [
    { k: "CONNECT", v: "register + link drone" },
    { k: "PLAN", v: "assign + upload" },
    { k: "FLY", v: "arm · auto · track live" },
  ],
};

/** Stats — consumed by the metrics BarChart graphic. */
export const metrics = [
  { label: "drones / gateway", value: 27, suffix: "", max: 30 },
  { label: "fleet at scale", value: 1000, suffix: "+", max: 1200 },
  { label: "uptime target", value: 99.9, suffix: "%", max: 100 },
  { label: "history kept", value: 30, suffix: "d", max: 30 },
];
