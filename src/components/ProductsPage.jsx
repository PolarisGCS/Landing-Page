import { useState } from "react";
import Nav from "./Nav";
import Background from "./Background";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("local");
  const [copiedId, setCopiedId] = useState(null);
  const reduce = useReducedMotion();

  const copyCommand = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="products-container">
      <Background reducedMotion={reduce} />
      <div className="overlay" />

      <Nav />

      <main className="products-main">
        {/* Header Section */}
        <div className="products-header">
          <div className="product-badge">POLARISGCS PRODUCT SUITE</div>
          <h1 className="product-title">
            Download PolarisGCS <span className="title-highlight">for your Fleet</span>
          </h1>
          <p className="product-subtitle">
            Bridge every drone to the cloud. Choose your gateway, command from any browser.
          </p>

          {/* Pill Tab Switcher */}
          <div className="product-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "local"}
              className={`product-tab ${activeTab === "local" ? "active" : ""}`}
              onClick={() => setActiveTab("local")}
            >
              <span className="tab-glyph">▤</span> Local Gateway (Desktop)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "android"}
              className={`product-tab ${activeTab === "android" ? "active" : ""}`}
              onClick={() => setActiveTab("android")}
            >
              <span className="tab-glyph">▣</span> Android Gateway (Mobile)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "cloud"}
              className={`product-tab ${activeTab === "cloud" ? "active" : ""}`}
              onClick={() => setActiveTab("cloud")}
            >
              <span className="tab-glyph">◐</span> Cloud GCS (Web Dashboard)
            </button>
          </div>
        </div>

        {/* Tab 1: Local Gateway (Desktop) -> 3 Options: Mac, Linux, Windows + CLI */}
        {activeTab === "local" && (
          <section className="product-section animate-fade-in">
            <div className="hero-box">
              <div className="hero-meta">POLARISGCS 2.0 · DESKTOP GATEWAY</div>
              <h2 className="hero-title">Local Gateway 2.0</h2>
              <p className="hero-desc">
                Bridges multiple concurrent drones&apos; MAVLink links to the cloud backend. Features an autonomous
                offline failsafe engine that executes return-to-launch and safety policies independently of cloud
                connectivity. Tier-blind architecture allocates bandwidth automatically across RF radio groups.
              </p>
            </div>

            {/* 3 OS Options Grid */}
            <div className="os-grid">
              {/* macOS */}
              <div className="os-card">
                <div className="os-card-header">
                  <span className="os-icon"></span>
                  <div>
                    <h3 className="os-name">macOS</h3>
                    <span className="os-arch">Apple Silicon &amp; Intel</span>
                  </div>
                </div>
                <div className="os-actions">
                  <a href="#download-mac-arm" className="btn-primary" onClick={(e) => { e.preventDefault(); alert("Starting Apple Silicon (.dmg) download..."); }}>
                    Download for Apple Silicon
                  </a>
                  <a href="#download-mac-intel" className="btn-secondary" onClick={(e) => { e.preventDefault(); alert("Starting Intel (.dmg) download..."); }}>
                    Download for Intel
                  </a>
                </div>
                <div className="os-reqs">
                  <strong>Minimum Requirements:</strong> macOS versions with Apple security update support. Min Version 12
                  (Monterey). Requires USB/serial driver permissions for physical SiK telemetry radios.
                </div>
              </div>

              {/* Windows */}
              <div className="os-card">
                <div className="os-card-header">
                  <span className="os-icon">❖</span>
                  <div>
                    <h3 className="os-name">Windows</h3>
                    <span className="os-arch">x64 &amp; ARM64</span>
                  </div>
                </div>
                <div className="os-actions">
                  <a href="#download-win-x64" className="btn-primary" onClick={(e) => { e.preventDefault(); alert("Starting Windows x64 (.exe) download..."); }}>
                    Download for x64
                  </a>
                  <a href="#download-win-arm" className="btn-secondary" onClick={(e) => { e.preventDefault(); alert("Starting Windows ARM64 (.exe) download..."); }}>
                    Download for ARM64
                  </a>
                </div>
                <div className="os-reqs">
                  <strong>Minimum Requirements:</strong> Windows 10 / Windows 11 (64-bit). COM port drivers included for
                  telemetry radios and MAVLink USB serial connections.
                </div>
              </div>

              {/* Linux */}
              <div className="os-card">
                <div className="os-card-header">
                  <span className="os-icon">🐧</span>
                  <div>
                    <h3 className="os-name">Linux</h3>
                    <span className="os-arch">x64 &amp; ARM64 (aarch64)</span>
                  </div>
                </div>
                <div className="os-actions">
                  <a href="#download-linux-x64" className="btn-primary" onClick={(e) => { e.preventDefault(); alert("Starting Linux x64 (.AppImage) download..."); }}>
                    Download for x64
                  </a>
                  <a href="#download-linux-arm" className="btn-secondary" onClick={(e) => { e.preventDefault(); alert("Starting Linux ARM64 (.AppImage) download..."); }}>
                    Download for ARM64
                  </a>
                </div>
                <div className="os-reqs">
                  <strong>Minimum Requirements:</strong> glibc &gt;= 2.28, glibcxx &gt;= 3.4.25 (e.g. Ubuntu 20.04+, Debian
                  10+, Fedora 36+, RHEL 8+). Requires dialout/tty group permissions for /dev/ttyUSB0.
                </div>
              </div>
            </div>

            {/* CLI Installation Section */}
            <div className="cli-install-box">
              <div className="cli-install-header">
                <h3 className="cli-install-title">Antigravity CLI &amp; Terminal Tools</h3>
                <p className="cli-install-desc">
                  Work with PolarisGCS directly in your codebase or edge companion computer. Build, debug, and connect your
                  fleet from your terminal. Describe what you need, and the gateway handles the rest.
                </p>
              </div>

              <div className="cli-cmd-grid">
                <div className="cli-cmd-card">
                  <div className="cli-cmd-label">macOS | Linux (Bash / Curl)</div>
                  <div className="cli-cmd-row">
                    <code>curl -fsSL https://get.polarisgcs.io/cli/install.sh | bash</code>
                    <button
                      type="button"
                      className={`btn-copy ${copiedId === "sh" ? "copied" : ""}`}
                      onClick={() => copyCommand("sh", "curl -fsSL https://get.polarisgcs.io/cli/install.sh | bash")}
                    >
                      {copiedId === "sh" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                <div className="cli-cmd-card">
                  <div className="cli-cmd-label">Windows PowerShell</div>
                  <div className="cli-cmd-row">
                    <code>irm https://get.polarisgcs.io/cli/install.ps1 | iex</code>
                    <button
                      type="button"
                      className={`btn-copy ${copiedId === "ps1" ? "copied" : ""}`}
                      onClick={() => copyCommand("ps1", "irm https://get.polarisgcs.io/cli/install.ps1 | iex")}
                    >
                      {copiedId === "ps1" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                <div className="cli-cmd-card">
                  <div className="cli-cmd-label">Windows CMD</div>
                  <div className="cli-cmd-row">
                    <code>curl -fsSL https://get.polarisgcs.io/cli/install.cmd -o install.cmd &amp;&amp; install.cmd &amp;&amp; del install.cmd</code>
                    <button
                      type="button"
                      className={`btn-copy ${copiedId === "cmd" ? "copied" : ""}`}
                      onClick={() =>
                        copyCommand(
                          "cmd",
                          "curl -fsSL https://get.polarisgcs.io/cli/install.cmd -o install.cmd && install.cmd && del install.cmd"
                        )
                      }
                    >
                      {copiedId === "cmd" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                <div className="cli-cmd-card">
                  <div className="cli-cmd-label">Python Core (Pip Universal)</div>
                  <div className="cli-cmd-row">
                    <code>pip install --upgrade polaris-gateway-cli pymavlink</code>
                    <button
                      type="button"
                      className={`btn-copy ${copiedId === "pip" ? "copied" : ""}`}
                      onClick={() => copyCommand("pip", "pip install --upgrade polaris-gateway-cli pymavlink")}
                    >
                      {copiedId === "pip" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Android Gateway -> 1 Option Only: Android */}
        {activeTab === "android" && (
          <section className="product-section animate-fade-in">
            <div className="hero-box">
              <div className="hero-meta">POLARISGCS MOBILE · FIELD OPERATIONS</div>
              <h2 className="hero-title">Android Gateway (Mobile)</h2>
              <p className="hero-desc">
                A full-featured mobile replacement for the desktop gateway. Connects one drone per phone or RC
                transmitter unit. Indistinguishable from desktop gateways to the backend — operate multiple Android phones
                and desktop gateways simultaneously in the same fleet session.
              </p>
            </div>

            <div className="android-layout">
              <div className="android-features">
                <h3 className="feature-list-title">Key Capabilities</h3>
                <ul className="feature-list">
                  <li>
                    <span className="check">✓</span>
                    <div>
                      <strong>USB-Serial Radio Support</strong>
                      <p>Direct OTG connection to physical SiK telemetry radios and serial telemetry dongles.</p>
                    </div>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <div>
                      <strong>SITL UDP Link</strong>
                      <p>Connect and test simulated ArduPilot drone fleets over WiFi UDP links on the go.</p>
                    </div>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <div>
                      <strong>Foreground Wake Lock</strong>
                      <p>Uninterrupted background operation with zero telemetry dropouts during long flight missions.</p>
                    </div>
                  </li>
                  <li>
                    <span className="check">✓</span>
                    <div>
                      <strong>Kotlin + Jetpack Compose Shell</strong>
                      <p>High-performance native Android UI wrapping the shared Python gateway core via Chaquopy.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 1 Option Only: Android Card */}
              <div className="os-card android-single-card">
                <div className="os-card-header">
                  <span className="os-icon">🤖</span>
                  <div>
                    <h3 className="os-name">Android</h3>
                    <span className="os-arch">Universal ARM64 &amp; x86_64</span>
                  </div>
                </div>
                <div className="os-actions">
                  <a href="#download-apk" className="btn-primary" onClick={(e) => { e.preventDefault(); alert("Starting Android Universal (.apk) download..."); }}>
                    Download APK (Universal)
                  </a>
                  <a href="#play-store" className="btn-secondary" onClick={(e) => { e.preventDefault(); alert("Opening Google Play Store page..."); }}>
                    Get it on Google Play Store →
                  </a>
                </div>
                <div className="os-reqs">
                  <strong>Minimum Requirements:</strong> Android 8.0 (Oreo / API level 26) or newer. Requires USB Host
                  (OTG) capability for physical serial radio dongles. 2GB+ RAM recommended.
                </div>
              </div>
            </div>

            {/* ADB CLI Box */}
            <div className="cli-install-box" style={{ marginTop: 32 }}>
              <div className="cli-cmd-card">
                <div className="cli-cmd-label">ADB Install (Developers &amp; RC Transmitter Units)</div>
                <div className="cli-cmd-row">
                  <code>adb install -r polaris-android-gateway-v2.4.apk</code>
                  <button
                    type="button"
                    className={`btn-copy ${copiedId === "adb" ? "copied" : ""}`}
                    onClick={() => copyCommand("adb", "adb install -r polaris-android-gateway-v2.4.apk")}
                  >
                    {copiedId === "adb" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Cloud GCS -> Link for the GCS + Backend Stack */}
        {activeTab === "cloud" && (
          <section className="product-section animate-fade-in">
            <div className="hero-box">
              <div className="hero-meta">POLARISGCS CLOUD · OPERATOR CONSOLE</div>
              <h2 className="hero-title">Cloud GCS Web Dashboard</h2>
              <p className="hero-desc">
                The single cloud-hosted command surface for your entire drone fleet. Operator dashboard for fleet
                management, mission planning, live telemetry on a map, historical playback, payload/video consoles, and
                read-only admin dashboard. Talks exclusively to the backend over REST and WebSocket — never communicates
                with gateways or drones directly.
              </p>
            </div>

            {/* Link for the GCS (Requirement 1) */}
            <div className="gcs-link-box">
              <div className="gcs-link-content">
                <h3 className="gcs-link-title">Launch the Cloud GCS Dashboard</h3>
                <p className="gcs-link-desc">
                  Access live telemetry, command mission tasks, monitor industrial Tier-1 video and LiDAR payload streams,
                  and review flight history across your fleets from any browser.
                </p>
                <div className="gcs-link-actions">
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary btn-glow"
                    onClick={(e) => {
                      // If running in preview/demo, alert or open link
                      if (window.location.port !== "5173") {
                        e.preventDefault();
                        alert("Opening Cloud GCS Web Dashboard (http://localhost:5173)...");
                      }
                    }}
                  >
                    Launch Cloud GCS Console →
                  </a>
                  <a href="#docs" className="btn-secondary">
                    Read Operator Manual &amp; API Specs
                  </a>
                </div>
                <div className="gcs-meta">
                  <span>✓ No installation required</span>
                  <span>✓ Sub-200ms WebSocket target</span>
                  <span>✓ 30-day telemetry retention</span>
                </div>
              </div>
            </div>

            {/* 3 Capability Highlight Cards */}
            <div className="cap-grid">
              <div className="cap-card">
                <h4 className="cap-title">🌐 Zero Install Footprint</h4>
                <p className="cap-desc">
                  Runs natively in Chrome, Firefox, Safari, Edge, and mobile browsers. No desktop plugins or Java
                  runtimes needed.
                </p>
              </div>
              <div className="cap-card">
                <h4 className="cap-title">⚡ Real-Time Fan-Out</h4>
                <p className="cap-desc">
                  Persistent WebSocket links powered by Redis pub/sub and FastAPI deliver real-time position, attitude, and
                  battery updates under 200 ms.
                </p>
              </div>
              <div className="cap-card">
                <h4 className="cap-title">📡 Tier-1 Payload Console</h4>
                <p className="cap-desc">
                  Industrial drones stream high-bandwidth LiDAR rings, thermal heatmaps, AI detections, and HLS live video
                  via MediaMTX directly to the console.
                </p>
              </div>
            </div>

            {/* Local Backend Stack (Docker Compose) */}
            <div className="cli-install-box" style={{ marginTop: 32 }}>
              <div className="cli-install-header">
                <h3 className="cli-install-title">Self-Hosted / Local Backend Stack</h3>
                <p className="cli-install-desc">
                  Run the entire containerized Cloud GCS backend (FastAPI + Postgres/TimescaleDB + Redis + Object Store +
                  MediaMTX) locally on your edge server or development PC with one Docker Compose command.
                </p>
              </div>
              <div className="cli-cmd-card">
                <div className="cli-cmd-label">Docker Compose (One-Command Stack)</div>
                <div className="cli-cmd-row">
                  <code>curl -fsSL https://get.polarisgcs.io/docker-compose.yml -o docker-compose.yml &amp;&amp; docker compose up -d</code>
                  <button
                    type="button"
                    className={`btn-copy ${copiedId === "docker" ? "copied" : ""}`}
                    onClick={() =>
                      copyCommand(
                        "docker",
                        "curl -fsSL https://get.polarisgcs.io/docker-compose.yml -o docker-compose.yml && docker compose up -d"
                      )
                    }
                  >
                    {copiedId === "docker" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
