export const telemetryFailsafe = {
  slug: "telemetry-failsafe",
  title: "Live Telemetry & Failsafe",
  tagline: "What's streamed, how it gets to the dashboard, and what happens when something goes wrong.",
  sections: [
    {
      heading: "What's streamed",
      body: [
        "Every connected drone streams position, attitude, battery, GPS quality, and flight mode back through its gateway. Drones with a richer telemetry allocation (see the Fleet & Tier Model page) add sensor health, vibration, wind estimate, and more.",
      ],
    },
    {
      heading: "How it reaches the dashboard",
      body: [
        "Telemetry travels drone → gateway → cloud backend → dashboard over WebSocket connections at each hop, so the map and instrument readouts update live rather than on a polling interval.",
      ],
    },
    {
      heading: "Failsafe monitoring",
      body: [
        "Gateways continuously watch each drone's telemetry stream for anomalies — link loss, critical battery levels, GPS degradation — and can raise alerts or trigger an automatic return-to-launch when a rule is tripped. The same failsafe rule set is kept consistent between the gateway (which reacts in real time) and the backend (which enforces the same policy centrally), so behavior doesn't drift between the two.",
      ],
    },
  ],
};
