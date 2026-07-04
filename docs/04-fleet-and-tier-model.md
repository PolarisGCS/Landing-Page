# Fleet & Tier Model

Two radio tiers, one automatic budgeting system, and up to 27 drones per gateway.

## Why Radio Tiers Exist in Drone Swarms

In real-world drone operations, fleets are inherently heterogeneous. An enterprise swarm often combines heavy industrial aircraft carrying power-hungry sensors with lightweight tactical scouts utilizing low-power radios. 

Attempting to push high-frequency telemetry and rich sensor payloads across low-bandwidth radio frequencies (such as 433MHz or 915MHz) instantly causes packet collisions, severe latency spikes, and catastrophic command link dropouts. To solve this physical constraint without complicating cloud operations, PolarisGCS groups vehicles into two distinct **Radio Tiers**. The cloud backend and web dashboard treat every drone identically, while edge gateways dynamically solve the bandwidth budgeting mathematics locally.

---

## Tier 2: Hobbyist & Long-Range RF-Only

Tier 2 vehicles represent airframes equipped exclusively with traditional long-range serial telemetry radios (e.g., SiK radios, TBS Crossfire, or RFD900). 

### Shared Radio Budget & Automatic Rebalancing
Because RF radios operate over narrow frequency bands, multiple aircraft must share a single radio communications channel. In traditional GCS software, operators are forced to manually tweak telemetry rates per vehicle. PolarisGCS automates this entirely:
* **Automatic Promotion**: The gateway continuously calculates the available radio bandwidth budget. It automatically promotes as many active drones per radio group as possible to a full ("rich") telemetry feed (20Hz attitude, position, velocity, and sensor health).
* **Lean Safety Throttling**: Any remaining vehicles in the shared group are seamlessly transitioned to a lean, safety-critical-only feed (1Hz position, altitude, heading, battery voltage, and armed state).
* **Dynamic Live Rebalancing**: Whenever a drone takes off, lands, joins, or leaves a radio group, the edge gateway recomputes the bandwidth equation in real time, rebalancing feed allocations instantly without operator intervention.

### Tier 2 Capacity Limits
To prevent radio round-trip latency from exceeding safety thresholds, PolarisGCS caps Tier 2 radio groups at **6 drones per physical radio channel**. A single Desktop Gateway supports up to 4 independent radio groups simultaneously, providing a maximum Tier 2 capacity of **24 drones per gateway**.

---

## Tier 1: Industrial & High-Bandwidth WiFi

Tier 1 vehicles represent commercial and industrial airframes equipped with dual-link communications: a standard lightweight safety radio link PLUS a dedicated high-bandwidth WiFi, mesh, or LTE/5G data link.

### Rich Sensor Payloads
Because Tier 1 vehicles possess massive data bandwidth, the gateway exempts them from RF radio throttling. Tier 1 drones continuously stream rich sensor payloads directly to the cloud, including:
* Real-time high-definition video feeds (1080p / 4K H.264/H.265 via WebRTC or RTSP).
* Live LiDAR 3D point cloud densities for real-time volumetric mapping.
* Radiometric thermal infrared imagery for inspection and search-and-rescue.

### Tier 1 Capacity Limits
Due to WiFi channel contention and wireless spectrum saturation, a single edge gateway supports up to **3 Tier 1 high-bandwidth drones simultaneously**, plus **1 designated ultra-high-definition video drone**, bringing total Tier 1 capacity to **4 vehicles per gateway**.

---

## Combined Gateway Capacity & Multi-Gateway Fan-In

By combining Tier 1 and Tier 2 allocations, the mathematical capacity of a single PolarisGCS Desktop Gateway is precisely determined:

$$\text{Total Gateway Capacity} = (4 \times 6\text{ Tier 2 Drones}) + 3\text{ Tier 1 Drones} + 1\text{ Video Drone} = 27\text{ Drones}$$

When operational requirements call for fleets exceeding 27 aircraft, PolarisGCS scales horizontally via **Multi-Gateway Fan-In**. An operator's cloud account can authenticate and bind dozens of independent Desktop and Android gateways simultaneously. The Cloud-GCS web dashboard automatically aggregates telemetry across all edge gateways, rendering hundreds of vehicles within a single, unified satellite canvas.

---

## Visualizing Grouped Swarms in the Dashboard

The Cloud-GCS web dashboard provides specialized fleet views that make tier distribution and radio grouping instantly visible to flight operators.

| Grouped Swarm View — Primary Radio Group | Grouped Swarm View — Secondary Radio Group |
| :---: | :---: |
| ![Grouped Swarm Fleet View 1 — Radio-group header showing member count and rich vs. critical telemetry highlights](/context-images/fleet_tab1.png) | ![Grouped Swarm Fleet View 2 — Secondary radio group demonstrating automatic bandwidth budgeting and tier distribution](/context-images/fleet_tab2.png) |

In the screenshots displayed above, the **Fleet Tab** organizes aircraft cleanly into distinct radio groups. 
* Notice the radio-group headers displaying the exact member count (e.g., `Group Alpha: 6 Drones`).
* Each drone card features a visual badge indicating its current bandwidth allocation — highlighting vehicles receiving **Rich** telemetry versus those throttled to **Critical** safety feeds.
* Operators can instantly verify that as vehicles execute their flight plans, the system maintains total radio discipline without sacrificing situational awareness.

---

## Step-by-Step: Managing Fleet Tiers & Radio Budgeting

To configure and verify fleet tiers during operational deployments:

1. **Organize Radio Hardware**: When setting up physical ground stations or SITL swarms, assign vehicles to specific MAVLink channels or radio frequencies (e.g., Channel 1 through Channel 4 for Tier 2 groups).
2. **Register Vehicles in Gateway**: Open the Desktop Gateway Add Drone panel and register your aircraft. Ensure Tier 1 WiFi vehicles are registered with their high-speed TCP/UDP endpoints, while Tier 2 RF vehicles are bound to their respective shared serial COM ports.
3. **Monitor Bandwidth Allocation**: Open the **Fleet Tab** on the Cloud-GCS dashboard. Observe the automatic promotion algorithm in action as active drones are highlighted with **Rich** telemetry badges while standby drones display **Critical** badges.
4. **Test Dynamic Rebalancing**: During a flight session, command one of the "Rich" Tier 2 drones to land and disarm; observe that the gateway instantly promotes a standby "Critical" drone in the same radio group to "Rich" telemetry within milliseconds.
5. **Scale via Multi-Gateway**: To expand your fleet beyond 27 vehicles, launch a second gateway instance on a separate field laptop, bind it to your cloud account via a pairing code, and verify that all new aircraft seamlessly populate your dashboard map.
