# Access Control & Admin

Who can see what today, centralized governance, and where role-based security is headed.

## Account Types Today: Regular User vs. Admin

Security and operational governance in PolarisGCS are built around a clean, two-tier authentication and authorization model. Every user authenticates through a standard OAuth2 / OpenID Connect identity provider (or secure JWT login) and is assigned an authenticated account profile in PostgreSQL. 

Once authenticated, an account operates under one of two strict privilege levels:

1. **Regular User Account**: Designed for day-to-day flight operators and field technicians. A regular user operates within an isolated tenant boundary. They have full read, write, and command authority over their own personally registered gateways, bound aircraft, authored waypoint missions, and historical flight sessions. They cannot view, query, or command gateways or vehicles belonging to other accounts.
2. **Administrator Account**: Designed for fleet commanders, system DevOps engineers, and compliance officers. An administrator receives **fleet-wide global visibility** across the entire PolarisGCS deployment. They can monitor every authenticated account, inspect all bound edge gateways across all tenants, review fleet-wide flight sessions, enforce centralized failsafe policies, and audit system logs.

---

## Strict Admin Elevation via Backend Scripts

A non-negotiable security rule in PolarisGCS is **strict elevation isolation**:

> [!IMPORTANT]
> **No Self-Service Admin Elevation**: There is no self-service path, UI button, API endpoint, or frontend form that allows an authenticated regular account to elevate itself to an administrator role. Admin access can **only** be granted through an internal, server-side administrative script executed directly on the cloud backend infrastructure.

To create an administrator account or elevate an existing user, a systems engineer must execute the administrative provisioning script via the command line on the backend host:

```bash
# Execute within the backend/ container or environment
python scripts/create_admin.py --email "commander@polarisgcs.com" --name "Fleet Commander" --elevate
```

This script verifies database credentials, generates a cryptographically salted password hash (or flags the identity provider UUID), and directly updates the user's relational record in PostgreSQL (`is_admin = TRUE`). This ensures that administrative elevation remains under strict infrastructure-level governance.

---

## Visualizing Admin Governance: Users, Fleet & Sessions

When an administrator signs into the Cloud-GCS web dashboard, the navigation chrome expands automatically to unlock the **Admin Console** — presenting specialized tabs for Overview, Fleet, Users, Sessions, Missions, Audit, and System health.

| Admin Fleet & Users Management Table | Admin Flight Sessions & Audit Table |
| :---: | :---: |
| ![Admin Users and Fleet Table — Centralized governance view showing test accounts, admin badges, and fleet assignments](/context-images/admin_page_fleet.png) | ![Admin Sessions Table — Historical flight session logs, active connection durations, and audit tracking](/context-images/admin_page_sessions.png) |

As demonstrated across the administrative captures above:
* **The Fleet & Users View (Left)**: Displays a centralized governance table aggregating every registered user and bound vehicle across the deployment. Administrators can clearly contrast accounts bearing the purple **Admin** badge against standard **User** roles, monitor how many drones are assigned per tenant, and revoke compromised gateway binding tokens instantly.
* **The Sessions & Audit View (Right)**: Provides an exhaustive historical log of all active and completed flight sessions. Administrators can audit exact takeoff timestamps, review total flight durations, inspect which gateway originated a flight, and export compliance reports for regulatory oversight.

> [!WARNING]
> **Data Privacy & PII Caution**: When capturing screenshots or generating administrative demo reports for public documentation or hackathon evaluations, **never display real user Personally Identifiable Information (PII)**. Always populate administrative tables using disposable test accounts and throwaway email addresses (e.g., `operator-test-1@polarisgcs.internal`).

---

## Future Direction: Granular Role-Based Access Control (RBAC)

While today's model intentionally maintains a streamlined binary distinction (Regular User vs. Administrator) to maximize clarity during rapid deployments, the architectural direction of PolarisGCS includes an expanded, granular **Role-Based Access Control (RBAC)** framework.

In future releases, account privileges will decompose into specialized functional roles:
* **Operator (Command Role)**: Authorized to connect gateways, upload waypoint plans, arm vehicles, and trigger real-time flight commands (`AUTO`, `RTL`, `PAUSE`).
* **Planner (Authoring Role)**: Authorized to author multi-waypoint missions, configure geofences, and simulate routes in SITL, but strictly **unauthorized** to arm physical hardware or initiate live takeoffs.
* **Observer (Read-Only Role)**: Authorized to view live satellite maps, watch video payloads, and monitor telemetry streams in real time, but restricted from altering flight plans or issuing vehicle commands.
* **Compliance Auditor**: Authorized to access historical flight logs, TimescaleDB telemetry archives, and failsafe audit trails without viewing live operational maps.

---

## Step-by-Step: Managing Users and Admin Elevation

To execute administrative governance and audit fleet security:

1. **Provision a Test Admin Account**: Access your backend server terminal (or docker container via `docker exec -it polaris-backend bash`). Run `python scripts/create_admin.py --email "admin@test.local" --password "SecurePass123!"` to generate your credentials.
2. **Access the Admin Console**: Open the Cloud-GCS web dashboard, sign in with your admin credentials, and verify that the top navigation bar displays the **Admin Chrome** with links to Overview, Fleet, Users, and Audit.
3. **Audit Active Gateways**: Click the **Fleet** tab in the admin console. Review all connected Desktop and Android gateways across all user accounts; verify that no unauthorized edge devices are binding to the system.
4. **Inspect Flight Sessions**: Click the **Sessions** tab. Select an active flight session to review its real-time telemetry fan-in, or select an archived session to download its time-series flight log from TimescaleDB.
5. **Revoke compromised Tokens**: If a field laptop or mobile phone is lost, locate the user's account in the **Users** table, click **Manage Gateways**, and click **Revoke Binding Token** to instantly terminate edge WebSocket authentication.
