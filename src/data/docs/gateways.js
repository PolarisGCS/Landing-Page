export const gateways = {
  slug: "gateways",
  title: "Gateways — Desktop & Android",
  tagline: "One shared Python core, two platforms — a PC app and a phone in your pocket.",
  sections: [
    {
      heading: "What a gateway does",
      body: [
        "A gateway is the bridge between drones and the cloud. It's the only piece of PolarisGCS that speaks MAVLink directly — it maintains the radio/network link to each drone, forwards telemetry up to the cloud backend, and pushes mission uploads and commands back down.",
      ],
    },
    {
      heading: "Desktop gateway",
      body: [
        "A PySide6 (Qt) desktop app for Windows, Linux, and macOS, built to run many drones at once. Registering a drone is a deliberate, manual action — an operator opens the Add Drone panel, enters the connection details, and confirms — there's no automatic scanning or silent attachment. It's built to be simulation-blind and tier-blind: it treats every MAVLink connection identically, whether it's a simulated drone or real hardware, and automatically manages the radio telemetry budget across whatever drones are connected.",
      ],
    },
    {
      heading: "Android gateway",
      body: [
        "A native Android app, capped to one connected drone per phone, for lightweight or field deployments. It embeds the same core Python gateway logic the desktop app uses — MAVLink handling, telemetry forwarding, mission upload — inside the Android app itself, rather than reimplementing it in Kotlin. This means both platforms share one well-tested core, and only the outer application shell (Qt vs. native Android UI) differs.",
        "Where the desktop app asks an operator to type in a connection string, the Android app discovers available drones by asking the backend directly and lets the operator pick one from a list and connect with a tap.",
      ],
    },
  ],
};
