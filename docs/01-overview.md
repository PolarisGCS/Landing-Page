# Overview

One console for a fleet that's part simulated, part real — and treated identically.

## The Problem in Fleet Operations

Running more than a handful of drones from a single command location is traditionally a patchwork of fragmented software and hardware: an RF radio transmitter for one hobbyist frame, a proprietary laptop application for an industrial hexacopter, and a manual spreadsheet tracking who is flying what mission. As drone fleets scale, this fragmentation introduces severe operational friction, safety bottlenecks, and data silos.

**PolarisGCS** solves this by providing an enterprise-grade, unified Ground Control System (GCS) engineered to command an entire heterogeneous fleet from a single web dashboard. Whether the drones on the other end of the wireless link are physical hardware flying in the field or a software-simulated swarm running for automated regression testing, PolarisGCS provides a seamless, centralized command-and-control interface.

---

## The Product, in Four Core Components

PolarisGCS is architected cleanly across four specialized components that each execute a single responsibility with zero operational overlap:

1. **Cloud-GCS (Web Dashboard)**: An interactive React + TypeScript single-page application where flight operators plan multi-waypoint missions, monitor real-time low-latency telemetry, manage Role-Based Access Control (RBAC), and oversee fleet-wide health.
2. **Cloud Backend**: An always-on FastAPI distributed service backed by PostgreSQL (for structured relational state), TimescaleDB (for high-volume time-series telemetry storage), and Redis (for real-time pub/sub fan-out). It serves as the single source of truth for all gateways and web clients.
3. **Gateway Apps (Desktop & Android)**: Dedicated edge applications positioned physically adjacent to RF radios and WiFi antennas. They are the only software components that speak native **MAVLink** directly to flight controllers, bridging drone telemetry and mission commands over secure WebSockets up to the cloud backend.
4. **Simulation Suite**: An ArduPilot Software-In-The-Loop (SITL) orchestration engine capable of spinning up virtual drone swarms that expose identical MAVLink TCP endpoints to physical hardware, enabling zero-risk development, load testing, and operator training.

---

## Visualizing the Unified Fleet

The hallmark of PolarisGCS is its ability to render physical and virtual swarms simultaneously on an interactive satellite canvas with zero UI distinction or visual degradation.

![Live Fleet Hero Shot — 4 to 6 simulated drones actively streaming telemetry on satellite map](/context-images/live_fleet_hero_shot.png)

In the live fleet view shown above, operators observe multiple drones operating concurrently across diverse geographic coordinates. Each drone is represented by a heading-rotated vector marker that updates smoothly in real time. At the bottom of the viewport, an interactive **Drone Card Carousel** displays essential flight parameters per aircraft — including battery state of charge, flight mode (e.g., `LOITER`, `AUTO`, `GUIDED`), and MSL/AGL altitude — allowing rapid visual inspection across swarms.

---

## Autonomous Mission Execution

When an aircraft is transitioned from manual planning to autonomous flight, PolarisGCS tracks its spatial execution with high-precision visual trails and real-time state telemetry.

![Mission Executing — Autonomous drone mid-flight with real-time accumulating route trail](/context-images/mission-executing.png)

As demonstrated in the mission execution capture above, once an operator dispatches a waypoint plan and commands `AUTO` mode, the dashboard traces an accumulating yellow route trail along the aircraft's actual flight path. This visual feedback is coupled with live instrument readouts, verifying that the drone is navigating precisely through its assigned spatial corridors while continuously streaming sensor health back to the cloud.

---

## The Two-Tier Drone Model

Every drone connects to the cloud through an edge gateway — never directly over the public internet. However, because physical aircraft carry vastly different radio hardware depending on their mission profile, PolarisGCS organizes vehicles into two distinct operational tiers:

* **Tier 2 (Hobbyist / Long-Range RF-Only)**: Vehicles utilizing traditional long-range telemetry radios (e.g., 433MHz / 915MHz SiK radios or TBS Crossfire). Because RF bandwidth is strictly limited, multiple drones share a single radio channel. PolarisGCS automatically manages a shared radio budget, promoting active drones to a full ("rich") telemetry feed while maintaining inactive or background drones on a lean, safety-critical feed (position, altitude, heading, battery, and armed status).
* **Tier 1 (Industrial / High-Bandwidth WiFi)**: Commercial and tactical airframes equipped with dedicated high-speed WiFi or LTE/5G data links. These vehicles stream high-bandwidth sensor payloads — such as real-time 1080p video, LiDAR point clouds, and thermal infrared imagery — alongside their lightweight safety telemetry link.

---

## Vehicle Entry: Behavior vs. Mission Drones

To accommodate both rapid testing and strict operational flight planning, PolarisGCS defines two distinct lifecycle pathways for how an aircraft enters the system:

1. **Behavior Drones**: Designed for immediate demonstration, load testing, and UI validation. When spawned via the simulation suite or attached in the field, a behavior drone immediately begins executing a preset flight pattern (such as a continuous loiter circle, stationary hover, perimeter patrol, or randomized polygon search) without requiring an operator to author a mission plan.
2. **Mission Drones**: Designed for rigorous operational deployments. A mission drone slot is pre-registered and reserved in the dashboard first. It remains an inactive reservation until an operator explicitly assigns it a validated sub-mission (a specific sequence of waypoints, geofences, and payload tasks). Once assigned, the vehicle takes off from the mission's designated origin coordinates and executes the exact spatial profile authored in the cloud.

---

## Step-by-Step: Getting Started with the Overview

To begin commanding your fleet from the Cloud-GCS overview:

1. **Verify Cloud Connectivity**: Check the top navigation bar to ensure the WebSocket connection indicator is glowing green, confirming real-time synchronization with the FastAPI backend and Redis pub/sub channels.
2. **Review Connected Devices**: Open the **Connected Devices** panel to inspect all currently bound Desktop and Android gateways, verifying that edge radios are online and reporting valid MAVLink heartbeats.
3. **Inspect Active Swarms**: Scroll through the bottom **Drone Card Carousel** to review battery levels, GPS satellite fix counts, and link quality across all Tier 1 and Tier 2 aircraft.
4. **Select an Aircraft for Command**: Click on any drone marker on the satellite map or select its corresponding card in the carousel to open its dedicated telemetry sidebar and initiate flight command workflows.
