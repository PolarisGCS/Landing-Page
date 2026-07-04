# Live Telemetry & Failsafe

What is streamed, how it reaches the dashboard in under 200 milliseconds, and what happens when anomalies occur.

## High-Frequency Telemetry Streaming (<200ms Latency)

In high-speed drone operations, stale telemetry is a critical safety hazard. PolarisGCS is engineered from the ground up to maintain end-to-end telemetry latency below **200 milliseconds** across distributed cloud networks.

Every connected vehicle continuously streams flight state parameters back through its edge gateway. Depending on the aircraft's radio tier and bandwidth allocation (see Fleet & Tier Model), the system broadcasts two distinct classes of telemetry:
1. **Critical Safety Telemetry (1Hz to 5Hz)**: Broadcast by all vehicles (including throttled Tier 2 RF drones). Includes WGS84 latitude/longitude position, MSL/AGL altitude, compass heading, battery voltage/percentage, GPS satellite count, and flight controller armed state.
2. **Rich Sensor Telemetry (10Hz to 20Hz)**: Broadcast by Tier 1 WiFi drones and promoted Tier 2 RF drones. Adds high-frequency 3D attitude (roll, pitch, yaw quaternion vectors), velocity vectors, accelerometer/gyroscope vibration analysis, estimated wind speed/direction, and comprehensive sensor health matrices.

---

## The Telemetry Pipeline: Edge to Dashboard

To achieve sub-200ms latency without database bottlenecks, telemetry data bypasses conventional REST polling entirely, traveling across a high-speed real-time WebSocket pipeline:

![Live Telemetry Real-Time WebSocket Pipeline](/context-images/diag_02_channels.png)

1. **Edge Extraction**: The Desktop or Android gateway extracts MAVLink `GLOBAL_POSITION_INT`, `ATTITUDE`, `SYS_STATUS`, and `VIBRATION` packets directly from the flight controller serial stream.
2. **Ingest Forwarding**: The gateway serializes the packets into lightweight JSON/binary payloads and transmits them over a persistent WebSocket connection (`/ws/ingest`) to the FastAPI cloud backend.
3. **Redis Pub/Sub Fan-Out**: The FastAPI backend asynchronously logs the record to TimescaleDB for historical auditing while simultaneously publishing the payload to an in-memory Redis cluster topic (`telemetry:{drone_id}`).
4. **Viewer Broadcasting**: The Redis cluster pushes the event instantly to all backend worker nodes, which broadcast the payload outbound over persistent **Viewer WebSockets** (`/ws/viewer`) to connected browser viewports.
5. **60fps UI Rendering**: The React dashboard receives the WebSocket frame and updates vehicle map markers and instrument gauges smoothly at 60 frames per second using direct ref-based DOM updates (avoiding heavy React state re-renders).

---

## Visualizing Critical vs. Rich Telemetry

The Cloud-GCS dashboard dynamically adapts its telemetry sidebar readouts based on the incoming data stream's bandwidth tier.

### Critical Safety Telemetry Readouts
When inspecting a vehicle operating on a lean RF radio budget, the dashboard presents a streamlined safety interface focusing on essential survival metrics.

| Critical Telemetry Feed — Primary View | Critical Telemetry Feed — Navigation View |
| :---: | :---: |
| ![Live Telemetry Critical Feed 1 — Safety telemetry block displaying position, altitude, battery, and armed state](/context-images/live_telemetry_critical_1.png) | ![Live Telemetry Critical Feed 2 — Secondary critical telemetry view showing GPS fix quality and basic heading](/context-images/live_telemetry_critical_2.png) |

In the critical telemetry panels shown above, operators can monitor exact geographic coordinates, battery state of charge, and GPS fix quality. The interface suppresses high-bandwidth instrument gauges to maintain visual clarity while preserving radio bandwidth.

### Rich Sensor Telemetry Readouts
When inspecting a Tier 1 WiFi vehicle or an active promoted Tier 2 aircraft, the dashboard unlocks an advanced avionics suite.

| Rich Telemetry — Attitude & Avionics | Rich Telemetry — Power & IMU Diagnostics |
| :---: | :---: |
| ![Live Telemetry Rich Feed 1 — Full telemetry sidebar with attitude indicator, vibration analysis, and wind estimates](/context-images/live_telemetry_rich_1.png) | ![Live Telemetry Rich Feed 2 — Expanded rich sensor readouts showing IMU health and power draw](/context-images/live_telemetry_rich_2.png) |
| **Rich Telemetry — Velocity & Airspeed** | **Rich Telemetry — Subsystem Health Matrix** |
| ![Live Telemetry Rich Feed 3 — Advanced navigation telemetry with velocity vectors and airspeed metrics](/context-images/live_telemetry_rich_3.png) | ![Live Telemetry Rich Feed 4 — Detailed sensor health matrix and subsystem status diagnostics](/context-images/live_telemetry_rich_4.png) |

As captured across the four rich telemetry panels above:
* **Panel 1 & 2**: Display an artificial horizon attitude indicator, live vibration clipping metrics, and instantaneous power draw (amperage and voltage sag).
* **Panel 3 & 4**: Present 3D velocity vectors, wind speed estimates, and a comprehensive subsystem health matrix confirming calibration status across accelerometers, magnetometers, and barometers.

---

## Automated Failsafe Monitoring & Policy Enforcement

In autonomous operations, relying solely on human reaction times during emergencies is insufficient. PolarisGCS implements a multi-layered automated **Failsafe Monitoring Engine** that continuously evaluates telemetry streams against safety rules.

### Common Failsafe Triggers
* **Command Link Loss**: If the gateway fails to receive a valid MAVLink heartbeat from the vehicle for more than 3.0 seconds, a link-loss anomaly is declared.
* **Critical Battery Depletion**: If battery state of charge drops below user-defined warning thresholds (e.g., $20\%$ warning, $15\%$ critical), an immediate power failsafe is triggered.
* **GPS Loss or HDOP Degradation**: If satellite count drops below 6 or Horizontal Dilution of Precision (HDOP) exceeds 2.5 meters during autonomous flight, navigation failsafe is engaged.
* **Excessive Vibration or Geofence Breach**: If accelerometer clipping exceeds safety limits or the vehicle crosses a spatial geofence boundary, an anomaly alert is raised.

### Gateway and Backend Policy Consistency
A critical engineering breakthrough in PolarisGCS is **Failsafe Policy Consistency**. In traditional drone operations, edge gateway rules often conflict with cloud backend rules. In PolarisGCS, failsafe policy definitions (such as auto-RTL trigger voltages and link timeout durations) are authored centrally in the cloud dashboard and synchronized cryptographically down to edge gateways.
* **Edge Enforcement (Real-Time)**: If link loss occurs, the edge gateway reacts locally within milliseconds, commanding the flight controller into **Return-To-Launch (RTL)** or **Land** mode over MAVLink without waiting for cloud round-trip authorization.
* **Cloud Enforcement (Centralized)**: The backend simultaneously logs the anomaly, alerts all connected dashboard operators, and updates fleet-wide status indicators.

---

## Visualizing Failsafe Events & Policy Configuration

The Cloud-GCS dashboard provides dedicated administrative screens for auditing failsafe histories and configuring automated recovery rules.

**Failsafe Event Timeline (Frontend)**

![Failsafe Policies Frontend — Interactive timeline of failsafe triggers, recoveries, and stand-down events](/context-images/failsafe_policies_frontend.png)

**Failsafe Policy Configuration (Backend)**

![Failsafe Policies Backend — Centralized policy configuration and automated RTL rule definitions](/context-images/failsafe_policies_backend.png)

In the captures shown above:
* **The Event Timeline (Above)**: Renders a color-coded chronological log of all historical anomalies across the fleet. Operators can track the precise timestamp when a failure was injected or triggered (red), monitor automated system recovery actions (yellow), and verify when the aircraft safely stood down or returned to base (green).
* **The Policy Editor (Below)**: Allows administrators to configure centralized safety thresholds — defining exact battery voltage cutoffs, geofence radii, and automated RTL behavior rules that synchronize across every connected gateway.

---

## Environmental Awareness via Google Weather API

Failsafe decisions don't rely on onboard telemetry alone — ground-truth environmental conditions matter too. PolarisGCS layers live weather data into the same dashboard surfaces operators use for failsafe monitoring.

* **Gateway-Published Weather (Primary Source)**: The local gateway at the flying site is the authoritative source. It pushes a `weather_update` message over its existing cloud WebSocket connection, carrying wind speed, wind direction, visibility, condition, and temperature — sourced from a real on-site sensor or a simulated value during SITL sessions. The frontend and preflight checks never need to know which.
* **Google Weather API (Fallback Source)**: If no gateway has published a fresh reading within the last two minutes, the backend automatically falls back to the [Google Weather API](https://developers.google.com/maps/documentation/weather) (`weather.googleapis.com`), fetching current conditions for the vehicle's last known coordinates. Results are grid-cached for five minutes to limit API calls.
* **Unified Interface**: Regardless of source, the same five fields (wind speed, wind direction, visibility, condition, temperature) are exposed to the dashboard, so operators see one consistent weather readout whether they're flying a real vehicle in the field or running a SITL swarm indoors.

This environmental data feeds directly into failsafe judgment calls — e.g., high wind speed or degraded visibility readings help operators correlate a vibration or navigation anomaly with external conditions rather than a vehicle fault.

---

## Step-by-Step: Monitoring Telemetry & Configuring Failsafes

To manage live telemetry and enforce safety policies during flight operations:

1. **Inspect Telemetry Latency**: In the top right corner of the Cloud-GCS dashboard, verify that the telemetry round-trip latency indicator displays green (<200ms). If latency exceeds 500ms, check edge gateway network bandwidth.
2. **Review Instrument Readouts**: Click on an active aircraft marker. Observe the right-hand telemetry sidebar; verify that attitude horizons respond smoothly and battery voltage readouts remain stable under load.
3. **Configure Safety Policies**: Navigate to the **System -> Failsafe Policies** tab. Set your mandatory fleet-wide thresholds (e.g., set Low Battery Warning to $22\%$ and Critical RTL Trigger to $17\%$). Click **Synchronize Policies** to push definitions to all active edge gateways.
4. **Test Failsafe Recovery (SITL)**: During a simulated swarm session, use `manage_instances.ps1` (Option 5 -> Inject Failure) to simulate a total GPS loss or battery drain anomaly. Observe the dashboard Event Timeline instantly log the trigger in red, while the vehicle marker autonomously alters heading to execute an emergency Return-To-Launch (RTL).
