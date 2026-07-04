export const simulation = {
  slug: "simulation",
  title: "Simulation / SITL",
  tagline: "Fly it in simulation before you fly it for real — with no special-case code.",
  sections: [
    {
      heading: "Why simulate",
      body: [
        "PolarisGCS includes a simulation suite built on ArduPilot's Software-In-The-Loop (SITL), so a fleet can be planned, flown, and tested end-to-end without any physical hardware. The simulated drones expose the same MAVLink connection real drones do, so the gateway, backend, and dashboard run the exact same code path either way — nothing about the simulated fleet is treated as a special case.",
      ],
    },
    {
      heading: "What an operator can do",
      list: [
        "Spin up individual simulated drones, or a whole swarm at once, choosing behavior drones or mission-ready drones for each.",
        "Assign a flight behavior (circle, hover, patrol, randomized route) to a demo drone.",
        "Inspect a running instance's live status and connection details.",
        "Inject specific failures — GPS loss, RC loss, battery drain, motor failure, wind, link loss — to see how failsafe monitoring responds.",
        "Tear the whole simulated fleet down cleanly in one step.",
      ],
    },
    {
      heading: "Same workflow, either way",
      body: [
        "A simulated fleet is registered with a gateway the same way a real fleet is, follows the same mission-assignment and upload flow, and streams telemetry through the same pipeline. The only difference is what's on the other end of the MAVLink connection.",
      ],
    },
  ],
};
