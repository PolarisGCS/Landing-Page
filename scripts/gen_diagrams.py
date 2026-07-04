"""Regenerates every diagram PNG referenced from landing-page/docs/*.md.

Run: python3 scripts/gen_diagrams.py
"""
from matplotlib.patches import FancyBboxPatch

from diagram_kit import (
    ACCENT, ARROW, INK, box, elbow_arrow, h_arrow, header,
    new_canvas, save, v_arrow,
)


def diag_05_lifecycle():
    w, h = 16, 6.6
    fig, ax = new_canvas(w, h)
    header(ax, w, "Autonomous 5-Stage Mission Execution Lifecycle",
           "State Machine Progression from Mission Planning to Autonomous Flight", h - 0.5)

    stages = [
        ("1. Reserve", "Lock Drone\nfor Mission"),
        ("2. Assign Plan", "Select Waypoints\n& Policies"),
        ("3. Connect", "Bind Gateway\nWebSocket"),
        ("4. Upload Plan", "Transmit MAVLink\nMission Items"),
        ("5. Start Mission", "Arm Vehicle\n& Auto Execute"),
    ]
    bw, bh, gap = 2.6, 2.3, 0.6
    total = len(stages) * bw + (len(stages) - 1) * gap
    x0 = (w - total) / 2 + bw / 2
    cy = 2.55

    centers = []
    for i, (title, sub) in enumerate(stages):
        cx = x0 + i * (bw + gap)
        centers.append(cx)
        box(ax, cx, cy, bw, bh, title, sub, accent=(i == len(stages) - 1),
            title_size=16.5, sub_size=12.5)

    for i in range(len(stages) - 1):
        x1 = centers[i] + bw / 2
        x2 = centers[i + 1] - bw / 2
        color = ACCENT if i == len(stages) - 2 else ARROW
        h_arrow(ax, x1, cy, x2, color=color, lw=2.6)

    save(fig, "diag_05_lifecycle.png")


def diag_09_cloud_roadmap():
    w, h = 15, 6.6
    fig, ax = new_canvas(w, h)
    header(ax, w, "Enterprise Cloud Production Roadmap",
           "Evolution from Single-Host Deployment to Managed Cloud Native Infrastructure", h - 0.5)

    stages = [
        ("Phase 1: Today", "Self-Hosted Docker\nCompose on Single VM"),
        ("Phase 2: Managed", "AWS ECS / EKS +\nManaged RDS PostgreSQL"),
        ("Phase 3: Global", "Multi-Region Cluster +\nGeo-Replicated Redis"),
    ]
    labels = ["Scale Up", "Geo Scale"]
    bw, bh, gap = 4.0, 2.5, 1.5
    total = len(stages) * bw + (len(stages) - 1) * gap
    x0 = (w - total) / 2 + bw / 2
    cy = 2.55

    centers = []
    for i, (title, sub) in enumerate(stages):
        cx = x0 + i * (bw + gap)
        centers.append(cx)
        box(ax, cx, cy, bw, bh, title, sub, accent=(i == 1), title_size=17, sub_size=13)

    for i in range(len(stages) - 1):
        x1 = centers[i] + bw / 2
        x2 = centers[i + 1] - bw / 2
        h_arrow(ax, x1, cy, x2, color=ACCENT, lw=2.6, label=labels[i], label_dy=0.55)

    save(fig, "diag_09_cloud_roadmap.png")


def diag_02_channels():
    w, h = 17.5, 9.8
    fig, ax = new_canvas(w, h)
    header(ax, w, "Real-Time Telemetry Pipeline & Channel Separation",
           "Ingest WebSocket (20Hz/drone) vs Viewer WebSocket (Fan-Out Broadcast)", h - 0.5)

    # gap must be wide enough that the longer "/ws/viewer (Stream)" pill
    # (with its padding) doesn't spill into the boxes on either side.
    bw, bh, gap = 3.7, 2.5, 2.4
    total = 3 * bw + 2 * gap
    x0 = (w - total) / 2 + bw / 2
    top_y = 6.55

    cx1, cx2, cx3 = x0, x0 + bw + gap, x0 + 2 * (bw + gap)
    box(ax, cx1, top_y, bw, bh, "Edge Gateways", "Desktop & Android\n(MAVLink Ingest)")
    box(ax, cx2, top_y, bw, bh, "FastAPI Backend", "Async Event Loop\n(TimescaleDB Log)", accent=True)
    box(ax, cx3, top_y, bw, bh, "Web Dashboards", "React / 60fps UI\n(Viewer Viewport)")

    h_arrow(ax, cx1 + bw / 2, top_y, cx2 - bw / 2, color=ACCENT, lw=2.8,
            label="/ws/ingest (20Hz)", label_dy=0.55)
    h_arrow(ax, cx2 + bw / 2, top_y, cx3 - bw / 2, color=ACCENT, lw=2.8,
            label="/ws/viewer (Stream)", label_dy=0.55)

    bot_y = top_y - bh / 2 - 2.35 - bh / 2
    box(ax, cx2, bot_y, bw, bh, "Redis Cluster", "Pub/Sub Fan-Out\nTopic: telemetry:*")
    v_arrow(ax, cx2, bot_y + bh / 2, top_y - bh / 2, color=ARROW, lw=2.4,
            label="Sub Broadcast")

    save(fig, "diag_02_channels.png")


def diag_03_pairing():
    w, h = 16, 7.6
    fig, ax = new_canvas(w, h)
    header(ax, w, "Gateway Account Binding & Pairing Code Workflow",
           "Cryptographic Binding Between Physical Edge Hardware and Cloud User Account", h - 0.5)

    bw, bh, gap = 4.0, 2.7, 1.9
    total = 3 * bw + 2 * gap
    x0 = (w - total) / 2 + bw / 2
    cy = 3.4

    cx1, cx2, cx3 = x0, x0 + bw + gap, x0 + 2 * (bw + gap)
    box(ax, cx1, cy, bw, bh, "Gateway App", "Generates 6-Digit Code\n(e.g., '849-201')")
    box(ax, cx2, cy, bw, bh, "FastAPI Backend", "Verifies Code & Generates\nJWT Gateway Token", accent=True)
    box(ax, cx3, cy, bw, bh, "Web Dashboard", "Operator Enters Code\nin Account Settings")

    y_up, y_dn = cy + 0.62, cy - 0.62
    # Gateway App <-> Backend
    h_arrow(ax, cx1 + bw / 2, y_up, cx2 - bw / 2, y_up, color=ARROW, lw=2.4,
            label="1. Request Pairing", label_dy=0.5)
    h_arrow(ax, cx2 - bw / 2, y_dn, cx1 + bw / 2, y_dn, color=ACCENT, lw=2.4,
            label="4. Return Auth Token", label_dy=-0.5)
    # Backend <-> Web Dashboard
    h_arrow(ax, cx2 + bw / 2, y_up, cx3 - bw / 2, y_up, color=ACCENT, lw=2.4,
            label="2. Display Code", label_dy=0.5)
    h_arrow(ax, cx3 - bw / 2, y_dn, cx2 + bw / 2, y_dn, color=ARROW, lw=2.4,
            label="3. Submit Code", label_dy=-0.5)

    save(fig, "diag_03_pairing.png")


def _fan_in_diagram(filename, title, subtitle, left_boxes, center, right, fan_label_color=ARROW):
    w, h = 17.6, 10.4
    fig, ax = new_canvas(w, h)
    header(ax, w, title, subtitle, h - 0.5)

    bw_l, bh_l = 4.3, 2.35
    x_left = 0.6 + bw_l / 2
    y_top, y_mid, y_bot = 7.15, 4.45, 1.75

    ys = [y_top, y_mid, y_bot]
    for (t, s, lbl), y in zip(left_boxes, ys):
        box(ax, x_left, y, bw_l, bh_l, t, s, title_size=15.5, sub_size=12)

    cx_center = 9.55
    bw_c, bh_c = 4.5, 2.7
    box(ax, cx_center, y_mid, bw_c, bh_c, center[0], center[1], accent=True, title_size=16, sub_size=12.5)

    for (t, s, lbl), y in zip(left_boxes, ys):
        x1 = x_left + bw_l / 2
        x2 = cx_center - bw_c / 2
        if y == y_mid:
            h_arrow(ax, x1, y, x2, color=ARROW, lw=2.3, label=lbl, label_dy=0.45)
        else:
            # Curve bows away from the midline so the top and bottom
            # connectors sweep toward the center box instead of cutting
            # a sharp diagonal into its corner.
            rad = -0.22 if y > y_mid else 0.22
            elbow_arrow(
                ax, (x1, y), (x2, y_mid), rad=rad,
                label=lbl,
                label_pos=(x1 + 1.7, y + (0.4 if y > y_mid else -0.4)),
            )

    cx_right = 15.25
    bw_r, bh_r = 3.3, 2.7
    box(ax, cx_right, y_mid, bw_r, bh_r, right[0], right[1], title_size=15.5, sub_size=12)
    h_arrow(ax, cx_center + bw_c / 2, y_mid, cx_right - bw_r / 2, color=ACCENT, lw=2.8,
            label=right[2], label_dy=0.55)

    save(fig, filename)


def diag_07_sitl_entry():
    _fan_in_diagram(
        "diag_07_sitl_entry.png",
        "ArduPilot SITL Swarm Execution & Entry Workflows",
        "Simulated Vehicle Architecture and Zero-Parity Telemetry Ingestion",
        left_boxes=[
            ("Option [1]: Spawn SITL", "Launch New Sim Instance", "Execute"),
            ("Option [4]: Connect Gateway", "Bind MAVLink TCP/UDP", "Link"),
            ("Option [8]: Inject Failure", "Simulate GPS/Battery Loss", "Trigger"),
        ],
        center=("SITL Swarm Manager", "manage_instances.ps1\n(Port Mappings)"),
        right=("Cloud Backend", "Zero Parity Rule:\nIdentical to Real", "MAVLink WS"),
    )


def diag_09_multi_gateway():
    _fan_in_diagram(
        "diag_09_multi_gateway.png",
        "Multi-Gateway Horizontal Scaling Architecture",
        "Fan-In Aggregation from Distributed Gateways to Cloud Load Balancer",
        left_boxes=[
            ("Gateway Alpha", "27 Drones (Tier 1/2)", "WSS Ingest"),
            ("Gateway Beta", "27 Drones (Tier 1/2)", "WSS Ingest"),
            ("Gateway Gamma", "27 Drones (Tier 1/2)", "WSS Ingest"),
        ],
        center=("Cloud Load Balancer", "Nginx / AWS ALB\n(TLS Termination)"),
        right=("FastAPI Cluster", "Auto-Scaled Worker\nNodes (Stateless)", "Fan-In Stream"),
    )


def diag_09_docker_stack():
    w, h = 16, 10.8
    fig, ax = new_canvas(w, h)
    header(ax, w, "Self-Hosted Docker Compose Infrastructure Stack",
           "Single-Host Production Architecture Running All Backend Services", h - 0.5)

    bw, bh = 3.6, 2.3
    col_gap, row_gap = 1.1, 1.5
    grid_w = 3 * bw + 2 * col_gap
    pad = 0.9
    container_x0 = (w - (grid_w + 2 * pad)) / 2
    container_w = grid_w + 2 * pad

    row1_y = 6.05
    row2_y = row1_y - bh - row_gap
    container_top = row1_y + bh / 2 + 1.35
    container_bottom = row2_y - bh / 2 - pad
    container_h = container_top - container_bottom

    container = FancyBboxPatch(
        (container_x0, container_bottom), container_w, container_h,
        boxstyle="round,pad=0,rounding_size=0.22",
        linewidth=2, edgecolor="#94a3b8", facecolor="#f6f8fb",
        linestyle=(0, (7, 5)), zorder=1,
    )
    ax.add_patch(container)
    ax.text(container_x0 + 0.55, container_top - 0.7, "Docker Host (docker-compose.yml)",
            fontsize=15.5, fontweight="bold", color=INK, family="Inter", va="center", zorder=2)

    x0 = container_x0 + pad + bw / 2
    cx1, cx2, cx3 = x0, x0 + bw + col_gap, x0 + 2 * (bw + col_gap)

    box(ax, cx1, row1_y, bw, bh, "FastAPI Backend", "Port 8000 (Ingest/API)", accent=True, title_size=15, sub_size=12)
    box(ax, cx2, row1_y, bw, bh, "Redis Cluster", "Port 6379 (Pub/Sub)", title_size=15, sub_size=12)
    box(ax, cx3, row1_y, bw, bh, "React Dashboard", "Port 3000 (Nginx UI)", title_size=15, sub_size=12)

    box(ax, cx1, row2_y, bw, bh, "PostgreSQL", "Port 5432 (Relational)", title_size=15, sub_size=12)
    box(ax, cx2, row2_y, bw, bh, "TimescaleDB", "Hypertables (Telemetry)", title_size=15, sub_size=12)
    box(ax, cx3, row2_y, bw, bh, "MinIO Storage", "Port 9000 (30-Day Logs)", title_size=15, sub_size=12)

    h_arrow(ax, cx1 + bw / 2, row1_y, cx2 - bw / 2, color=ACCENT, lw=2.6)
    h_arrow(ax, cx2 + bw / 2, row1_y, cx3 - bw / 2, color=ACCENT, lw=2.6)
    v_arrow(ax, cx1, row1_y - bh / 2, row2_y + bh / 2, color=ARROW, lw=2.2)
    v_arrow(ax, cx2, row1_y - bh / 2, row2_y + bh / 2, color=ARROW, lw=2.2)

    save(fig, "diag_09_docker_stack.png")


if __name__ == "__main__":
    diag_05_lifecycle()
    diag_09_cloud_roadmap()
    diag_02_channels()
    diag_03_pairing()
    diag_07_sitl_entry()
    diag_09_multi_gateway()
    diag_09_docker_stack()
