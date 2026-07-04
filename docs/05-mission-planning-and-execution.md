# Mission Planning & Execution

From an assigned waypoint plan to an armed, autonomous drone executing precision flight paths.

## Behavior Drones vs. Mission Drones

In PolarisGCS, understanding the distinction between vehicle creation models is essential for mastering mission workflows:

1. **Behavior Drones**: These vehicles are designed for rapid system verification, demo environments, and dashboard load testing. When spawned in the simulation suite, a behavior drone immediately begins flying a preset autonomous pattern (such as a loiter circle, hover, perimeter patrol, or randomized polygon route) the instant it is created. It requires zero waypoint authoring or operator intervention.
2. **Mission Drones**: These vehicles represent rigorous operational deployments. A mission drone is created as an **inactive reservation slot** in the cloud dashboard. It does not physically exist in airspace or begin flying until an operator explicitly authors a waypoint plan and assigns the sub-mission to the reserved slot. Because taking off requires known geographic coordinates, the vehicle is only spawned by the simulation suite (or readied on the physical flight deck) after assignment occurs.

---

## The 5-Stage Mission Lifecycle

PolarisGCS enforces a deterministic, 5-stage sequential lifecycle for all autonomous mission operations. This structured workflow prevents human error and guarantees fleet readiness prior to takeoff.

![Autonomous 5-Stage Mission Lifecycle](/context-images/diag_05_lifecycle.png)

### 1. Reserve
An operator or automated script calls `/api/drones/preregister` to create a vehicle reservation slot. The drone ID appears in the Cloud-GCS dashboard's assignment picker with a status of `awaiting_spawn`.

### 2. Assign Sub-Mission
The operator opens the Cloud-GCS mission editor and authors a specific spatial sub-mission (a defined sequence of takeoff, waypoints, geofences, and landing instructions). They assign this plan to the reserved drone slot. For SITL simulations, this assignment triggers `manage_instances.ps1` to spawn the virtual drone at the plan's exact takeoff coordinates and update its status to `active`.

### 3. Connect Gateway
With the aircraft active and powered on, the operator opens their edge gateway (Desktop or Android), inputs the drone ID and connection string, and establishes MAVLink communication. The dashboard vehicle indicator transitions to **ONLINE**.

### 4. Upload Plan
Once every assigned aircraft in the mission reports an online heartbeat, the dashboard enables the **Upload** action. Clicking Upload transmits the waypoint plan over WebSockets to the gateway, which writes the mission sequentially to the drone's flight controller over MAVLink. Upon receipt of a valid `MISSION_ACK` packet from the drone, the backend updates the mission state from `queued` to `uploaded`.

### 5. Start Mission
Only after every single drone assigned to the mission has successfully acknowledged upload receipt does the dashboard enable the **Start** button. Clicking Start transmits the arming command and transitions flight controllers into autonomous **AUTO** mode, initiating synchronized liftoff across the fleet.

---

## Gating, Not Guessing: Fail-Safe Readiness

A critical engineering philosophy in PolarisGCS is **gating, not guessing**. The dashboard strictly disables workflow transitions until cryptographic and protocol-level proof of readiness is established:
* The **Upload** button remains hard-disabled until $100\%$ of assigned aircraft report active WebSocket and MAVLink heartbeats.
* The **Start** button remains hard-disabled until $100\%$ of assigned aircraft return a valid `MISSION_ACK` MAVLink packet.

This prevents operators from accidentally launching a swarm when an edge vehicle has a disconnected radio or an incomplete waypoint plan.

---

## Authoring Missions in the Interactive Editor

The Cloud-GCS dashboard features a rich, client-side geographic mission authoring canvas that allows planners to construct complex multi-waypoint routes with zero latency.

![Mission Editor Mid-Workflow — Takeoff, Waypoint, and Land pins connected by polyline route with active tool banner and detail panel](/context-images/mission_editor_mid_workflow.png)

As shown in the mission editor capture above, planners click directly on the satellite map to place sequential navigation pins — automatically distinguishing between **Takeoff** points (green), standard navigation **Waypoints** (yellow/orange), and precision **Land** coordinates (red). 
* An active-tool hint banner across the top guides operators through tool selection.
* The right-hand **Waypoint Detail Panel** allows granular adjustment of altitude (MSL/AGL), acceptance radius, loiter time, and airspeed per waypoint.
* Planners can author, modify, and save multi-drone mission templates entirely client-side before committing assignments to physical aircraft.

---

## Live Autonomous Execution & Route Tracking

Once a mission is dispatched and commanded to start, the dashboard transitions seamlessly from planning mode to live operational execution mode.

![Mission Executing — Autonomous drone mid-flight with real-time accumulating route trail](/context-images/mission-executing.png)

In the execution view above, an armed aircraft is observed mid-mission following its uploaded waypoint trajectory. As the vehicle progresses, the dashboard renders a vibrant yellow **Accumulating Route Trail** that traces its historical flight path across the satellite canvas. Operators can verify in real time that the aircraft's actual spatial execution matches the intended polyline corridor precisely, while monitoring distance-to-next-waypoint and estimated time of arrival (ETA) readouts in the telemetry sidebar.

---

## Step-by-Step: Planning and Executing an Autonomous Mission

To execute a complete multi-waypoint mission from scratch:

1. **Author the Flight Plan**: Navigate to the **Missions** tab in the Cloud-GCS dashboard and click **Create Mission**. Use the map tools to drop a Takeoff pin, several navigation Waypoints, and a Land pin. Configure waypoint altitudes in the right-hand panel and save the plan.
2. **Reserve & Assign Aircraft**: Click **Assign Drones** within the mission editor. Select an available pre-registered mission drone slot (or create a new reservation) and bind it to your authored waypoint sequence.
3. **Establish Edge Connection**: Ensure your physical aircraft is powered on (or wait for the SITL script to spawn your virtual drone at the takeoff point). Open your Desktop or Android gateway and connect to the vehicle's MAVLink endpoint.
4. **Verify Fleet Online Status**: Check the dashboard mission panel; confirm that the assigned vehicle's status badge transitions from offline to glowing green (**ONLINE**).
5. **Upload Waypoint Plan**: Click the blue **Upload Mission** button. Observe the progress indicator as waypoints are transmitted to the flight controller. Wait for the status confirmation to read `✓ Acknowledged / Awaiting MISSION_ACK` and transition to **UPLOADED**.
6. **Arm and Launch**: Click the red **Start Mission** button and confirm launch authorization. Observe the vehicle arm its motors, liftoff autonomously, and begin tracing its yellow execution trail across the live map.
