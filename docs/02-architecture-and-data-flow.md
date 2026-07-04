# Architecture & Data Flow

How the frontend, backend, and gateways actually talk to each other across distributed networks.

## The Four Core Architectural Components

PolarisGCS is engineered as a decoupled, event-driven distributed system. By isolating user interface rendering, persistence, protocol bridging, and vehicle simulation into standalone service boundaries, the architecture guarantees fault tolerance and horizontal scalability.

1. **Cloud-GCS (Frontend)**: A modern React 19 + Vite single-page application typed in TypeScript. It handles map authoring, mission assembly, telemetry visualization, and administrative governance. It never communicates with drones or edge gateways directly; all operations pass through the cloud backend.
2. **Cloud Backend**: A high-performance Python FastAPI service. It acts as the central synchronization broker and API gateway. It maintains relational entities in PostgreSQL, stores time-series telemetry in TimescaleDB hypertables, and leverages Redis pub/sub channels to fan out live WebSocket streams to thousands of concurrent browser clients.
3. **Gateway Apps (Edge Layer)**: Multi-platform applications (Desktop PySide6/Qt and native Android) deployed at the edge. Gateways are the sole components authorized to speak native **MAVLink** (via serial, UDP, or TCP) to flight controllers. They translate MAVLink packets into JSON/binary WebSocket payloads and stream them to the cloud backend.
4. **Simulation Suite**: A PowerShell and Python orchestration framework (`manage_instances.ps1`) that launches local ArduPilot Software-In-The-Loop (SITL) processes. Each SITL instance exposes a standard MAVLink TCP port, allowing edge gateways to bind to simulated drones exactly as if they were physical radio transmitters.

---

## Gateway Topology & Connected Devices

To maintain total visibility over distributed edge hardware, the Cloud-GCS dashboard provides an integrated **Connected Devices** management console.

![Connected Devices Popover — Gateway row expanded showing paired drones and online/offline status dots](/context-images/connected_devices.png)

As illustrated in the capture above, operators can expand any authenticated gateway row to inspect its downstream radio topology in real time. The interface displays each paired drone's unique identifier, active MAVLink endpoint, and a color-coded online/offline heartbeat indicator. This hierarchical view proves that a single operator account can fan in telemetry from multiple independent edge gateways (e.g., combining a ruggedized field laptop with an Android mobile gateway) into one unified command screen.

---

## Two Separate Real-Time Channels: Ingest vs. Viewer

A foundational architectural design decision in PolarisGCS is the complete physical and logical separation of telemetry ingestion from dashboard visualization. This prevents downstream browser lag or UI congestion from ever impacting safety-critical edge communications.

![Telemetry Pipeline and Real-Time Channel Separation](/context-images/diag_02_channels.png)

1. **The Ingest Channel**: When a gateway receives a MAVLink attitude or position packet from a drone, it immediately pushes the payload over an **Ingest WebSocket** connection directly to the FastAPI backend. The backend validates the payload, writes high-frequency records to TimescaleDB, and publishes the event to a dedicated Redis pub/sub topic (`telemetry:{drone_id}`).
2. **The Viewer Channel**: When an operator opens the Cloud-GCS dashboard, the browser establishes a separate **Viewer WebSocket** connection to the backend. The backend subscribes to the relevant Redis topics on behalf of the client and streams telemetry outbound. 
3. **In-Memory Fallback**: If the Redis cluster experiences transient network partition or downtime, the FastAPI backend automatically falls back to an **in-memory routing bus**. Ingestion and live viewer streaming continue uninterrupted without dropping critical safety telemetry.

---

## REST APIs vs. Real-Time WebSockets

PolarisGCS divides communication protocols strictly based on operational semantics:

* **REST API (HTTP/JSON)**: Utilized exclusively for discrete, transactional, and CRUD operations. This includes user authentication, gateway registration, drone slot reservation (`/api/drones/preregister`), waypoint mission authoring, historical session auditing, and administrative user management.
* **Real-Time WebSockets**: Utilized exclusively for continuous, low-latency, and bidirectional data streams. This includes 20Hz telemetry broadcasting, mission upload progress tracking, MAVLink acknowledgement (`MISSION_ACK`) propagation, and live failsafe event notifications.

---

## Storage & Persistence Strategy

The backend relies on a dual-engine database architecture tailored to data access patterns:

* **PostgreSQL**: Stores structured relational state, including user accounts, RBAC roles, gateway binding tokens, drone metadata, saved mission definitions, and flight session audit logs.
* **TimescaleDB**: An advanced PostgreSQL extension optimized for time-series data. High-volume telemetry (altitude, battery voltage, GPS HDOP, vibration metrics) is written directly into TimescaleDB **hypertables**. Hypertables automatically partition data across time intervals, enabling rapid time-range queries for post-flight analysis while enforcing automated rolling 30-day retention policies.

---

## The Simulation Parity Advantage: 100% Real-World Accuracy

A major engineering achievement in PolarisGCS is our **Zero-Parity Design**:

> [!IMPORTANT]
> **Guaranteed Field Reliability**: We designed our system so that a simulated (SITL) drone gets zero artificial benefits or shortcuts over a physical hardware drone. Because our cloud servers and edge gateways treat simulated aircraft exactly identical to real drones in the sky, any mission, multi-drone swarm, or automated failsafe that succeeds in simulation is 100% guaranteed to perform with the exact same precision and reliability on real hardware in physical airspace.

This strict rule ensures that when a developer or operator runs a simulation test, they are exercising the exact same production routing, budgeting, and database execution paths that govern live aircraft in physical airspace.

---

## Step-by-Step: Verifying Architecture & Data Flow

To verify system data flow during development or deployment:

1. **Check Backend Health**: Navigate to the System administration page to confirm that PostgreSQL, TimescaleDB, Redis, and MinIO storage services report green health tiles with low round-trip latency.
2. **Monitor Gateway Ingestion**: Open the terminal logs of a running `local-gateway` instance and confirm that incoming MAVLink packets are being successfully forwarded to the `/ws/ingest` backend endpoint without backpressure.
3. **Validate Viewer Fan-Out**: Open multiple browser tabs to the Cloud-GCS dashboard simultaneously; observe that telemetry updates remain perfectly synchronized across all client viewports via Redis pub/sub fan-out.
4. **Test Redis Resilience**: During a SITL simulation session, temporarily pause the local Redis container; verify that the backend cleanly engages in-memory telemetry fallback and dashboard vehicle markers continue moving smoothly.
