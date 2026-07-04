# Deployment & Scale

What is running today, self-hosted Docker orchestration, and the roadmap for enterprise cloud production.

## Today's Deployment: Self-Hosted Docker Compose Stack

In its current operational release, PolarisGCS is packaged and deployed as an integrated, self-hosted container stack using **Docker Compose**. This architecture allows engineering teams, field units, and hackathon evaluators to stand up the entire cloud ground control infrastructure on a single local server, private cloud VM, or tactical field laptop in under five minutes.

![Self-Hosted Docker Compose Stack](/context-images/diag_09_docker_stack.png)

### Core Services in the Local Stack
The root `docker-compose.yml` orchestrates five containerized services that communicate across an isolated Docker bridge network:
1. **`backend` (FastAPI + Python 3.11)**: The core API broker and WebSocket ingestion engine. On container startup, it automatically executes database migrations via `alembic upgrade head`, ensuring schema consistency before opening port `8000`.
2. **`db` (PostgreSQL + TimescaleDB)**: The relational and time-series persistence layer. It is pre-configured with TimescaleDB extensions to partition high-volume flight telemetry into hypertables, enforcing an automated **rolling 30-day telemetry retention window**.
3. **`redis` (Redis 7.0 Alpine)**: The high-speed in-memory pub/sub broker. It decouples edge gateway telemetry ingestion from dashboard viewer broadcasting, enabling low-latency fan-out to concurrent web clients.
4. **`minio` (MinIO S3-Compatible Storage)**: Object storage utilized for archiving large binary payloads, such as drone camera capture logs, LiDAR point cloud dumps, and exported MAVLink binary mission logs (`.tlog` / `.bin`).
5. **`frontend` (React 19 + Vite)**: Served either via the built-in Vite development server (port `5173` / `3000`) for rapid UI iteration or bundled into static HTML/CSS/JS served via high-performance Nginx for local staging.

---

## Where It Is Headed: Managed Cloud Production Roadmap

While the self-hosted Docker Compose stack provides exceptional portable performance, scaling PolarisGCS to support nationwide commercial drone fleets requires transitioning to a distributed, cloud-native production architecture. This represents the intended engineering roadmap for enterprise deployments:

![Enterprise Cloud Production Roadmap](/context-images/diag_09_cloud_roadmap.png)

1. **Managed Database & Time-Series Hosting**: Migrating from self-hosted container databases to **Timescale Cloud** (or AWS RDS PostgreSQL with Timescale extensions). This provides automated multi-region failover, continuous point-in-time backups, and dedicated NVMe storage tiers capable of ingesting millions of telemetry data points per second.
2. **Managed In-Memory Caching**: Replacing single-node Redis containers with **AWS ElastiCache for Redis** (or GCP Memorystore) configured in highly available Redis Cluster mode across multiple Availability Zones (AZs).
3. **Stateless Backend Auto-Scaling**: Deploying the FastAPI backend across Kubernetes clusters (AWS EKS or GCP GKE). Because WebSocket sessions are decoupled via Redis pub/sub, backend pods remain entirely stateless — allowing horizontal Horizontal Pod Autoscaling (HPA) to spin up dozens of API instances dynamically during peak flight hours.
4. **Edge CDN Static Dashboard Delivery**: Decoupling the React web dashboard from application servers entirely. The compiled Vite bundle (`dist/`) is hosted on **AWS S3** and distributed globally via **Amazon CloudFront CDN** (or Cloudflare Pages / GitHub Pages for open-source releases), ensuring sub-50ms page load times for flight operators worldwide.

---

## Scaling the Fleet: Horizontal Multi-Gateway Fan-In

A common engineering question in drone operations is: *How does PolarisGCS scale past the physical capacity of a single radio frequency?*

As detailed in the Fleet & Tier Model chapter, a single Desktop Gateway is physically bounded by RF radio channel limits and WiFi spectrum contention to **27 concurrent aircraft** (24 Tier 2 RF drones across 4 radio groups + 3 Tier 1 WiFi drones + 1 video drone). 

To scale a fleet to hundreds or thousands of concurrent aircraft, PolarisGCS utilizes **Horizontal Multi-Gateway Fan-In**:

![Horizontal Multi-Gateway Fleet Fan-In](/context-images/diag_09_multi_gateway.png)

* **Independent Edge Nodes**: An enterprise deployment deploys multiple Desktop Gateways (running on ruggedized PCs across different airfield sectors) or Android Gateways (carried by mobile field operators across a smart city).
* **Unified Account Aggregation**: Every gateway authenticates to the same cloud account (or administrative tenant) using unique cryptographic binding tokens.
* **Centralized Dashboard Fan-In**: The FastAPI backend ingests telemetry from dozens of independent gateways simultaneously. When an operator opens the Cloud-GCS dashboard, the satellite map aggregates all incoming streams into a **single unified fleet view**. An operator can command 100+ drones seamlessly across 4 different edge gateways without ever needing to know which physical laptop or radio frequency is routing a specific aircraft's MAVLink packets.

---

## Step-by-Step: Standing Up and Verifying the Deployment Stack

To deploy and verify the self-hosted Docker Compose infrastructure from scratch:

1. **Clone & Verify Requirements**: Ensure your host system has Docker Engine 24+ and Docker Compose v2 installed. Navigate to the root `DRONES` project workspace containing `docker-compose.yml`.
2. **Launch Container Services**: Execute `docker compose up -d` in your terminal. Docker will pull required Alpine Linux images, create the bridge network, and launch PostgreSQL, Redis, MinIO, and FastAPI backend services in the background.
3. **Verify Database Migrations**: Execute `docker compose logs -f backend` and watch the startup sequence; confirm that Alembic outputs `INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.` and reports successful upgrade to the latest database revision without SQL errors.
4. **Check Service Port Bindings**: Execute `docker ps` and confirm that all core service ports are cleanly exposed:
   * Backend API & WebSockets: `http://localhost:8000`
   * PostgreSQL / TimescaleDB: `localhost:5432`
   * Redis Pub/Sub Broker: `localhost:6379`
   * MinIO Storage Console: `http://localhost:9001`
5. **Launch Web Dashboard**: Navigate to the `landing-page/` (or `frontend/`) directory. Execute `npm install` followed by `npm run dev` (or `npm run preview`). Open your browser to the local server URL, verify that the WebSocket status indicator glows green, and confirm that your self-hosted cloud command station is operational.
