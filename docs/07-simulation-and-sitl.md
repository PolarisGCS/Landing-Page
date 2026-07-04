# Simulation / SITL

Fly it in simulation before you fly it for real — with zero special-case code across the entire platform.

## Why Simulate in Enterprise Drone Operations

Deploying untested software, waypoint plans, or failsafe policies directly onto physical aircraft carrying expensive sensor payloads is an unacceptable operational risk. Field testing is inherently constrained by weather conditions, battery charging cycles, regulatory airspace restrictions, and physical hardware wear.

PolarisGCS eliminates this bottleneck by incorporating a comprehensive, enterprise-grade **Simulation Suite** built directly on top of ArduPilot's industry-standard **Software-In-The-Loop (SITL)** framework. SITL compiles the actual ArduPilot C++ flight controller firmware into native desktop executable processes. This allows operators and developers to simulate complete multi-drone swarms, complex waypoint missions, and catastrophic hardware failures entirely in software on a local machine.

---

## The Zero-Parity Architectural Rule

The defining architectural breakthrough of the PolarisGCS Simulation Suite is the **Simulation Parity Rule** (as mandated in the root project engineering guidelines):

> [!CAUTION]
> **Absolute Code Parity**: No gateway or backend code may ever distinguish a SITL simulated drone from a real physical drone. There must be zero `drone_type` checks, zero `spawn_status` special-casing, and zero string matching against prefixes like `DRONE-SIM-*`. Every MAVLink connection is treated identically.

Why is this rule so critical? In many commercial drone platforms, simulation tools use "mock" data generators or simplified REST APIs that bypass the actual MAVLink serial parsing and bandwidth budgeting code. When a bug exists in the binary MAVLink parser or radio budgeting logic, the simulation passes cleanly, but physical aircraft crash in the field. 

In PolarisGCS, a virtual SITL drone exposes the exact same MAVLink TCP socket (`tcp:127.0.0.1:5760+`) that a physical SiK radio or Ethernet modem exposes. When you connect a Desktop Gateway to a SITL swarm, the gateway executes the exact same binary packet decoding, automatic radio tier promotion, telemetry throttling, and WebSocket ingestion code that it runs on a tactical airfield. If a workflow succeeds in SITL, it is cryptographically and logically guaranteed to succeed on physical hardware.

---

## Orchestrating Swarms with `manage_instances.ps1`

All simulation lifecycle operations are centrally orchestrated through the automation script located at `ardupilot-SITL-instances/manage_instances.ps1`. This script serves as the master console for spinning up virtual airspace.

### The 9-Option SITL Console Menu
When executing `.\manage_instances.ps1` in a terminal, operators are presented with a 9-option interactive command menu:

![SITL Vehicle Entry Workflows](/context-images/diag_07_sitl_entry.png)

* **Option 1 (Spawn)**: Allows operators to spin up individual virtual aircraft or entire multi-drone swarms (e.g., spawning a 6-drone Tier 2 radio group) in a synchronized spatial grid.
* **Option 2 (List)**: Displays a tabular overview of all running SITL processes, their assigned vehicle IDs, and their mapped MAVLink TCP ports (e.g., Port `5760`, `5770`, `5780`).
* **Option 4 (Behavior Simulation)**: Launches standalone Python behavior runners that command virtual aircraft to fly preset demonstration patterns (circles, hovers, patrols) without needing web dashboard mission assignments.
* **Option 5 (Inject Failure)**: Unlocks an advanced fault-injection submenu for testing automated failsafe monitoring.

---

## Vehicle Entry in SITL: Behavior vs. Mission Drones

When utilizing the SITL suite, operators must select the appropriate vehicle entry workflow based on their testing goals:

```
[Behavior Drones] --(Spawn Immediately via PS1)--> [Execute Preset Pattern (Circle/Hover/Patrol)]
[Mission Drones]  --(Reserve Slot in Dashboard)--> [Wait for Mission Assignment] --> [Spawn at Takeoff Coords]
```

1. **Behavior Drones (Immediate Spawn)**: When selecting Behavior Drones during Option 1, the script immediately launches the ArduPilot SITL process at default airfield coordinates. When Option 4 is triggered, the drone immediately takes off and flies a loiter or patrol pattern. This is ideal for exercising dashboard map rendering and load testing 27-drone gateway fan-in.
2. **Mission Drones (Deferred Spawn)**: When testing operational mission workflows, aircraft must not spawn prematurely. 
   * First, the operator calls `/api/drones/preregister` (or uses the dashboard) to reserve a mission drone slot. The backend registers the vehicle in `awaiting_spawn` state.
   * Second, the operator authors a multi-waypoint mission in the Cloud-GCS editor and assigns it to the reserved slot.
   * Third, `manage_instances.ps1` detects the assignment, reads the mission's exact starting takeoff coordinates, launches the SITL process at that precise geographic location, and updates the backend state to `active`. Now the operator can connect their gateway and execute the upload/start sequence.

---

## Real-Time Failure Injection & Failsafe Testing

To verify that automated failsafe policies (see Live Telemetry & Failsafe) function correctly under catastrophic conditions, Option 5 of the SITL manager provides an interactive **Failure Injection Submenu**:

```
--- Inject Failure / Anomaly ---
 [A] Simulate Total GPS Loss (Set HDOP > 5.0m, Sats = 0)
 [B] Simulate RC / Command Link Loss (Drop MAVLink Heartbeats)
 [C] Simulate Critical Battery Drain (Force Voltage < 18.0V)
 [D] Simulate Severe Motor Failure / IMU Vibration Clipping
 [E] Simulate Extreme Wind Shears (30+ knots crosswind)
 [F] Cancel / Return to Main Menu
```

When an operator triggers an anomaly against an active SITL aircraft:
* **Immediate Edge Reaction**: The connected Desktop Gateway detects the MAVLink anomaly (e.g., zero satellites or battery sag) within milliseconds and automatically fires an emergency `RTL` (Return-To-Launch) or `LAND` command down to the virtual flight controller.
* **Dashboard Visual Verification**: On the Cloud-GCS web dashboard, the vehicle marker instantly changes color, an emergency alert banner banners across the top of the viewport, and the Failsafe Event Timeline logs the exact trigger and automated recovery sequence in real time.

---

## Step-by-Step: Running a Complete SITL Swarm Simulation

To stand up a virtual drone swarm and execute an end-to-end simulated mission:

1. **Launch the SITL Manager**: Open a PowerShell or Bash terminal within `ardupilot-SITL-instances/` and execute `.\manage_instances.ps1` (or `./manage_instances.sh` on Linux).
2. **Spawn a Virtual Swarm**: Select **Option 1**, specify a swarm size of `4` vehicles, select **Behavior Drones**, and confirm launch. Observe the console output confirming 4 active SITL processes bound to TCP ports `5760`, `5770`, `5780`, and `5790`.
3. **Connect via Desktop Gateway**: Open your PolarisGCS Desktop Gateway application. Click **Add Drone**, register each of the 4 virtual endpoints (e.g., `tcp:127.0.0.1:5760`), and click **Connect**.
4. **Verify Dashboard Fan-In**: Open the Cloud-GCS web dashboard. Verify that all 4 simulated aircraft appear live on the satellite map and begin populating the bottom Drone Card Carousel with 20Hz telemetry.
5. **Launch Behavior Flight**: In the SITL terminal, select **Option 4 (Start Simulation)** and choose `Circle Pattern`. Observe all 4 aircraft autonomously arm, liftoff to 30 meters AGL, and begin flying synchronized orbital patterns on your web dashboard.
6. **Inject a Catastrophic Failure**: In the SITL terminal, select **Option 5 (Inject Failure)**, select Drone 2, and trigger **Option C (Critical Battery Drain)**. Watch your web dashboard immediately flash a low-battery failsafe warning while Drone 2 autonomously breaks orbit and executes a precision landing at its launch coordinates.
7. **Clean Teardown**: Once testing is complete, select **Option 6 (Reset All Instances)** in the SITL terminal to cleanly terminate all virtual flight controllers and clear temporary logs.
