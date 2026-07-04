export const deploymentScale = {
  slug: "deployment-scale",
  title: "Deployment & Scale",
  tagline: "What's running today, and the direction it's headed for production.",
  sections: [
    {
      heading: "Today",
      body: [
        "The system runs as a self-hosted stack: the backend alongside PostgreSQL/TimescaleDB, Redis, and supporting services, brought up together for local development and demos. Telemetry history is kept on a rolling 30-day window.",
      ],
    },
    {
      heading: "Where it's headed",
      body: [
        "The intended production path moves the database and cache to managed cloud hosting and serves the web dashboard from a separately hosted static deployment, rather than running everything as one self-managed stack. This is a stated direction, not something already live — today's deployment is the local stack described above.",
      ],
    },
    {
      heading: "Scaling the fleet",
      body: [
        "Capacity scales per gateway (see Fleet & Tier Model) and an account can connect multiple gateways at once, with the dashboard fanning in telemetry and control across all of them into a single fleet view — that's the intended path to growing a fleet past what one gateway can carry.",
      ],
    },
  ],
};
