export const architecture = {
  slug: "architecture",
  title: "Architecture & Data Flow",
  tagline: "How the frontend, backend, and gateways actually talk to each other.",
  sections: [
    {
      heading: "The four components",
      body: [
        "**Cloud-GCS** is a React + TypeScript web app — mission planning, live map, fleet management, and an admin dashboard for fleet-wide visibility.",
        "The **cloud backend** is a FastAPI service backed by PostgreSQL (with TimescaleDB for time-series telemetry) and Redis (for live pub/sub fan-out). It owns fleet/mission/user state and is the single source of truth every other component talks to.",
        "**Gateway apps** (desktop and Android) are the only things that speak MAVLink directly to drones. Everything else — cloud backend, dashboard — only ever sees a gateway's WebSocket connection, never a drone directly.",
        "The **simulation suite** spawns simulated drones that expose the exact same MAVLink connection a real drone would, so nothing downstream needs to know the difference.",
      ],
    },
    {
      heading: "Two separate real-time channels",
      body: [
        "Telemetry flows in one direction and out another, deliberately kept apart: a gateway pushes telemetry into an *ingest* channel on the backend; the backend publishes it to Redis; a completely separate *viewer* channel picks it up from Redis and pushes it out to whichever dashboards are watching that fleet. If Redis is briefly unavailable, the backend falls back to routing telemetry in-memory so live viewing keeps working.",
        "This separation means an ingest hiccup never blocks a viewer connection, and a slow or disconnected viewer never backs up onto a gateway.",
      ],
    },
    {
      heading: "REST vs. real-time",
      body: [
        "Anything that's a discrete action — registering a gateway, assigning a mission, uploading a waypoint plan, managing users — goes over a conventional REST API. Anything continuous — telemetry, mission acknowledgements — goes over the WebSocket channels described above.",
      ],
    },
    {
      heading: "Persistence",
      body: [
        "Structured fleet state (users, gateways, drones, missions, flight sessions) lives in PostgreSQL. High-volume telemetry is stored in TimescaleDB hypertables, which are built for exactly this kind of time-series data — fast writes, fast range queries, and efficient retention.",
      ],
    },
    {
      heading: "One rule that shapes everything",
      body: [
        "The backend and gateways are built to never know or care whether a given connection is a simulated drone or physical hardware. There's no special-casing anywhere in the core business logic — a simulated fleet and a real fleet run through the exact same code path, which is precisely what makes the simulation suite useful for realistic testing.",
      ],
    },
  ],
};
