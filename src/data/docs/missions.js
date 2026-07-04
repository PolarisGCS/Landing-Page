export const missions = {
  slug: "missions",
  title: "Mission Planning & Execution",
  tagline: "From an assigned waypoint plan to an armed, autonomous drone.",
  sections: [
    {
      heading: "Behavior drones vs. mission drones",
      body: [
        "A **behavior drone** starts flying a preset pattern (circle, hover, patrol, or a randomized route) the moment it's created — useful for demos and for exercising the fleet view without needing a real plan.",
        "A **mission drone** is different: it's reserved with an ID first, and only actually starts flying once an operator assigns it a specific sub-mission from the dashboard. The takeoff location isn't known until that assignment happens, so the drone doesn't exist as a flying entity until then.",
      ],
    },
    {
      heading: "The mission lifecycle",
      list: [
        "**Reserve** — a mission drone slot is created and appears in the dashboard's assignment picker.",
        "**Assign** — an operator assigns it a sub-mission (a set of waypoints, geofence, and task).",
        "**Connect** — once the drone is active, the operator connects it to a gateway (desktop or Android).",
        "**Upload** — the dashboard sends the full waypoint plan to the gateway, which uploads it to the drone over MAVLink. The drone acknowledges receipt.",
        "**Start** — once every assigned drone in a mission has acknowledged its upload, the operator can arm and start the mission — the drone switches to autonomous (AUTO) flight and follows its plan.",
      ],
    },
    {
      heading: "Gating, not guessing",
      body: [
        "The dashboard only enables the next step once the previous one is verifiably done across the whole fleet: Upload is only available once every assigned drone shows as connected, and Start is only available once every drone in the mission has acknowledged its upload. This keeps a partially-ready fleet from being started by mistake.",
      ],
    },
  ],
};
