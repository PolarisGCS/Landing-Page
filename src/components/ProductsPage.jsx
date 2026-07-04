import { useState, useCallback, useRef, useEffect, memo } from "react";
import Nav from "./Nav";
import Background from "./Background";
import { useReducedMotion } from "../hooks/useReducedMotion";

// ──────────────────────────────────────────────────────────────
// HOISTED STATIC DATA (Vercel Best Practice: server-hoist-static-io / rendering-hoist-jsx)
// ──────────────────────────────────────────────────────────────
const DESKTOP_OS_LIST = [
  {
    id: "mac",
    name: "macOS",
    arch: "Apple Silicon & Intel",
    primaryLabel: "Download for Apple Silicon",
    secondaryLabel: "Download for Intel",
  },
  {
    id: "win",
    name: "Windows",
    arch: "x64 & ARM64",
    primaryLabel: "Download for x64",
    secondaryLabel: "Download for ARM64",
  },
  {
    id: "linux",
    name: "Linux",
    arch: "x64 & ARM64",
    primaryLabel: "Download AppImage (x64)",
    secondaryLabel: "Download AppImage (ARM64)",
  },
];

const CLI_COMMANDS_LIST = [
  { id: "sh", label: "macOS / Linux", code: "curl -fsSL https://get.polarisgcs.io/cli/install.sh | bash" },
  { id: "ps1", label: "Windows PowerShell", code: "irm https://get.polarisgcs.io/cli/install.ps1 | iex" },
  { id: "pip", label: "Pip (universal)", code: "pip install --upgrade polaris-gateway-cli pymavlink" },
];

const ANDROID_FEATURES_LIST = [
  { title: "USB radio support", desc: "Connect physical SiK telemetry radios over USB-OTG." },
  { title: "SITL over WiFi", desc: "Connect to simulated ArduPilot fleets on the go." },
  { title: "Stays connected", desc: "Keeps the link alive in the background during long flights." },
];

const CLOUD_CAPABILITIES_LIST = [
  { title: "Nothing to install", desc: "Runs in any modern browser, desktop or mobile." },
  { title: "Real-time updates", desc: "Position, attitude, and battery in under 200ms." },
  { title: "Video & payload", desc: "Live video and sensor streams alongside telemetry." },
];

// ──────────────────────────────────────────────────────────────
// MODULE-SCOPED COMPONENT HELPERS (Vercel Best Practice: rerender-no-inline-components)
// ──────────────────────────────────────────────────────────────
const OsCard = memo(function OsCard({ item }) {
  return (
    <div className="simple-card">
      <h3 className="simple-card__title">{item.name}</h3>
      <span className="simple-card__sub">{item.arch}</span>
      <div className="simple-card__actions">
        <a
          href={`#download-${item.id}-primary`}
          className="simple-btn simple-btn--primary"
          onClick={(e) => {
            e.preventDefault();
            alert(`Starting download: ${item.name} (${item.primaryLabel})...`);
          }}
        >
          {item.primaryLabel}
        </a>
        <a
          href={`#download-${item.id}-secondary`}
          className="simple-link"
          onClick={(e) => {
            e.preventDefault();
            alert(`Starting download: ${item.name} (${item.secondaryLabel})...`);
          }}
        >
          {item.secondaryLabel}
        </a>
      </div>
    </div>
  );
});

const CliRow = memo(function CliRow({ item, copiedId, onCopy }) {
  const isCopied = copiedId === item.id;
  return (
    <div className="cli-row">
      <div className="cli-row__label">{item.label}</div>
      <div className="cli-row__code-wrap">
        <code>{item.code}</code>
        <button
          type="button"
          className={`simple-copy-btn ${isCopied ? "is-copied" : ""}`}
          onClick={() => onCopy(item.id, item.code)}
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
});

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("local");
  const [copiedId, setCopiedId] = useState(null);
  const timerRef = useRef(null);
  const reduce = useReducedMotion();

  // Clean up timer on unmount (Vercel Best Practice: rerender-functional-setstate / memory safety)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copyCommand = useCallback((id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  }, []);

  return (
    <div className="products-container">
      {/* staticFrame={true} prevents background from scrubbing with scroll (Requirement 1) */}
      <Background reducedMotion={reduce} staticFrame={true} />
      <div className="overlay" />

      <Nav />

      <main className="products-main">
        <header className="simple-header">
          <h1 className="simple-header__title">
            Deploy PolarisGCS <span className="tech-highlight">across your fleet.</span>
          </h1>
          <p className="simple-header__subtitle">
            Bridge physical radios, simulated fleets, and mobile companions to a single cloud dashboard.
          </p>

          <nav className="simple-tabs" aria-label="Product Runtime Target">
            <button
              type="button"
              className={`simple-tab ${activeTab === "local" ? "is-active" : ""}`}
              onClick={() => setActiveTab("local")}
            >
              Desktop Gateway
            </button>
            <button
              type="button"
              className={`simple-tab ${activeTab === "android" ? "is-active" : ""}`}
              onClick={() => setActiveTab("android")}
            >
              Mobile Gateway
            </button>
            <button
              type="button"
              className={`simple-tab ${activeTab === "cloud" ? "is-active" : ""}`}
              onClick={() => setActiveTab("cloud")}
            >
              Cloud Dashboard
            </button>
          </nav>
        </header>

        {/* Tab 1: Local Gateway (Desktop) -> 3 Options: Mac, Linux, Windows + CLI */}
        {activeTab === "local" ? (
          <section className="tech-section animate-fade-in">
            <p className="simple-section-desc">
              Bridges multiple concurrent drones to the cloud backend, with an offline failsafe that runs return-to-launch even without a connection.
            </p>

            <div className="tech-grid-3">
              {DESKTOP_OS_LIST.map((os) => (
                <OsCard key={os.id} item={os} />
              ))}
            </div>

            <div className="cli-section">
              <h3 className="cli-section__title">Install via terminal</h3>
              <div className="cli-grid">
                {CLI_COMMANDS_LIST.map((cmd) => (
                  <CliRow key={cmd.id} item={cmd} copiedId={copiedId} onCopy={copyCommand} />
                ))}
              </div>
            </div>
          </section>
        ) : activeTab === "android" ? (
          /* Tab 2: Android Gateway -> 1 Option Only: Android */
          <section className="tech-section animate-fade-in">
            <p className="simple-section-desc">
              A mobile replacement for the desktop gateway — one drone per phone, and interchangeable with desktop gateways in the same fleet session.
            </p>

            <div className="android-simple-layout">
              <ul className="simple-feature-list">
                {ANDROID_FEATURES_LIST.map((f) => (
                  <li key={f.title} className="simple-feature-list__item">
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </li>
                ))}
              </ul>

              <div className="simple-card simple-card--hero">
                <h3 className="simple-card__title">Android Gateway</h3>
                <span className="simple-card__sub">Universal ARM64 & x86_64 · Android 8.0+</span>
                <div className="simple-card__actions">
                  <a
                    href="#download-apk"
                    className="simple-btn simple-btn--primary"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Starting Android Universal (.apk) download...");
                    }}
                  >
                    Download APK
                  </a>
                  <a
                    href="#play-store"
                    className="simple-link"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Opening Google Play Store page...");
                    }}
                  >
                    Get it on Google Play →
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Tab 3: Cloud GCS -> Link for the GCS + Backend Stack */
          <section className="tech-section animate-fade-in">
            <div className="console-launch-card">
              <div className="console-launch-card__glow" />
              <h3 className="console-launch-card__title">Launch the Cloud GCS Dashboard</h3>
              <p className="console-launch-card__desc">
                Live telemetry, mission control, video and payload streams, and flight history — from any browser.
              </p>
              <div className="console-launch-card__actions">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="simple-btn simple-btn--primary simple-btn--glow"
                  onClick={(e) => {
                    if (window.location.port !== "5173") {
                      e.preventDefault();
                      alert("Opening Cloud GCS Web Dashboard (http://localhost:5173)...");
                    }
                  }}
                >
                  Launch Cloud GCS Console →
                </a>
                <a href="#/docs" className="simple-link">
                  Read the docs
                </a>
              </div>
            </div>

            <div className="tech-grid-3">
              {CLOUD_CAPABILITIES_LIST.map((cap) => (
                <div key={cap.title} className="simple-card">
                  <h4 className="simple-card__title" style={{ fontSize: 18 }}>{cap.title}</h4>
                  <p className="simple-card__desc">{cap.desc}</p>
                </div>
              ))}
            </div>

            <div className="cli-section">
              <h3 className="cli-section__title">Self-hosted backend (Docker Compose)</h3>
              <div className="cli-grid">
                <CliRow
                  item={{ id: "docker", label: "One-command stack", code: "curl -fsSL https://get.polarisgcs.io/docker-compose.yml -o docker-compose.yml && docker compose up -d" }}
                  copiedId={copiedId}
                  onCopy={copyCommand}
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
