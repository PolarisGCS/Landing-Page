# Gateways — Desktop & Android

One shared Python core, two platforms — a PC app for command stations and a mobile phone in your pocket for field operations.

## What a Gateway Does in PolarisGCS

In the PolarisGCS architecture, an edge gateway is the critical bridge between physical drone hardware and the cloud infrastructure. Gateways are the **only** components in the entire system authorized to speak native **MAVLink** directly to flight controllers over serial, UDP, or TCP connections. 

A gateway performs three core functions:
1. **Protocol Translation**: It decodes binary MAVLink telemetry packets from aircraft and packages them into structured JSON/binary WebSocket messages for upstream cloud ingestion.
2. **Bandwidth & Tier Budgeting**: It actively monitors the RF radio link budget, automatically promoting high-priority drones to rich telemetry feeds while throttling background vehicles to lean safety feeds.
3. **Command & Upload Delivery**: It receives waypoint mission plans and flight commands (such as `ARM`, `DISARM`, `AUTO`, `RTL`) from the cloud dashboard and pushes them down to the flight controller over MAVLink, verifying receipt via `MISSION_ACK` packets.

---

## Desktop Gateway (PySide6 / Qt)

The Desktop Gateway is a cross-platform application (compatible with Windows, Linux, and macOS) built using **PySide6 (Qt)** and Python. It is engineered specifically for command-station environments where operators need to manage dozens of concurrent aircraft simultaneously.

### Manual Registration Architecture

A fundamental design rule of the Desktop Gateway is **deliberate manual registration**. To prevent accidental radio attachments or unpredictable swarm interference, the gateway never performs automatic network scanning, never runs auto-attach timers (`QTimer`), and never silently binds to broadcast endpoints.

![Desktop Gateway Add Drone Dialog — Manual registration form and table of registered MAVLink endpoints](/context-images/add_drone_dialog.png)

As shown in the Add Drone capture above, registering an aircraft requires an operator to explicitly open the Add Drone dialog, input the vehicle's unique identification string, specify its MAVLink connection endpoint (e.g., `tcp:127.0.0.1:5760` for SITL or a serial COM port for physical radios), and manually confirm registration. This table of registered endpoints gives operators total deterministic control over radio channel allocation.

### Multi-Drone Fleet Management Panel

Once vehicles are registered and connected, the Desktop Gateway provides a high-density tabular interface for real-time edge monitoring.

![Desktop Gateway Fleet Panel — Multi-drone QTableView displaying real-time battery, position, GPS quality, and flight mode](/context-images/registered_drones.png)

The Fleet Panel rendered above utilizes a high-performance `QTableView` to display vital telemetry across multiple connected drones simultaneously. Operators can inspect individual battery voltages, GPS satellite fix quality, flight modes, and connection status per row without needing to open the web dashboard. This proves the gateway's ability to act as an autonomous local command console even during cloud network interruptions.

---

## Android Gateway (Mobile Field Operations)

The Android Gateway is a native mobile application designed for lightweight tactical deployments, field inspections, and single-operator missions. Unlike the Desktop app which scales to 27 drones, the Android Gateway is intentionally capped to **one connected drone per phone**, optimizing battery consumption and mobile CPU usage.

### Shared Python Core

Rather than reimplementing complex MAVLink parsing, telemetry budgeting, and WebSocket synchronization logic in Kotlin, the Android Gateway embeds the **exact same Python core library** utilized by the Desktop Gateway directly inside the Android application package (via Chaquopy / Python-for-Android). Both platforms execute identical core logic; only the outer presentation shell (Qt Desktop UI vs. native Android Material UI) differs.

### Account Binding & Pairing Workflow

To connect an edge gateway (Desktop or Android) to a user's cloud account securely, PolarisGCS employs an interactive pairing code workflow.

![Gateway Account Binding Workflow](/context-images/diag_03_pairing.png)

| Gateway Pairing Screen | Web Dashboard Account Binding |
| :---: | :---: |
| ![Account Binding Gateway — Backend URL entry and pairing code generation](/context-images/account_binding_gateway.png) | ![Account Binding Frontend — Web dashboard pairing code verification and account authentication](/context-images/account_binding_frontend.png) |

1. On the gateway application (left), the operator inputs the target Cloud Backend URL and initiates binding. The gateway contacts the server and generates a unique, time-limited 6-character pairing code.
2. On the Cloud-GCS web dashboard (right), the operator navigates to their account settings, enters the 6-character code, and confirms authorization.
3. The backend validates the token and issues a persistent cryptographic cryptographic JWT to the gateway, instantly linking all downstream edge telemetry to the operator's account.

---

## Pre-Flight Guided Checklist

To maximize operational safety prior to launching autonomous missions, the Desktop Gateway includes an integrated **Pre-Flight Checklist** workflow.

![Pre-Flight Checklist — Guided 5-phase pre-flight verification with real-time status indicators](/context-images/preflight_checklist.png)

As illustrated above, the checklist guides operators through five rigorous pre-flight verification phases:
1. **Radio Link & Heartbeat Verification**: Confirms stable MAVLink packet reception and low packet loss.
2. **GPS Fix & HDOP Validation**: Ensures 3D GPS lock with sufficient satellite count and low horizontal dilution of precision.
3. **Sensor & IMU Health**: Verifies accelerometer, gyroscope, magnetometer, and barometer calibration.
4. **Battery Voltage & Capacity Check**: Validates that state of charge meets minimum threshold requirements for the assigned flight plan.
5. **Geofence & Policy Verification**: Confirms that safety geofences and return-to-launch (RTL) altitudes are properly written to non-volatile flight controller memory.

---

## Step-by-Step: Using Desktop and Android Gateways

### Operating the Desktop Gateway
1. **Launch the Application**: Execute `python run.py` within the `local-gateway/` directory to open the Qt interface.
2. **Bind to Cloud Account**: Click **Account Binding**, enter your Cloud Backend URL, and complete the 6-character pairing workflow on the web dashboard.
3. **Register Aircraft manually**: Click **Add Drone**, input the target drone ID and MAVLink endpoint (e.g., `tcp:127.0.0.1:5760`), and click **Register**.
4. **Execute Pre-Flight Checks**: Select the connected aircraft, open the **Pre-Flight Checklist** tab, and verify that all 5 safety phases report green status icons before notifying the web operator that the vehicle is ready for mission upload.

### Operating the Android Gateway
1. **Launch on Mobile Device**: Open the PolarisGCS Android application on your field handset or tactical tablet.
2. **Connect to Cloud Server**: Input your server URL on the binding screen and authorize the session via your web account.
3. **Discover Available Drones**: Unlike the desktop app where connection strings are typed manually, tap **Discover Drones** to query the backend for available assigned vehicle slots.
4. **Bind and Stream**: Select your assigned field drone from the list and tap **Connect**. The phone immediately establishes MAVLink communication over OTG USB serial or local WiFi, forwarding real-time telemetry up to the cloud.
