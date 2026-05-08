import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BASE = "/depi-mind-app-v2/showcase";

const LINKS = {
  github: "https://github.com/fadyy2k/depi-mind-app-v2",
  docs: "https://fadyy2k.github.io/depi-mind-app-v2/",
  showcase: "https://fadyy2k.github.io/depi-mind-app-v2/showcase/",
  jenkins: "http://depi-jenkins-depi.duckdns.org:8080",
  app: "http://depi-k3s-depi.duckdns.org:30080",
  health: "http://depi-k3s-depi.duckdns.org:30080/api/health",
  argocd: "http://depi-k3s-depi.duckdns.org:32000",
  sonarqube: "http://depi-jenkins-depi.duckdns.org:9000",
  dockerBackend: "https://hub.docker.com/r/fadyy2k/mind-backend",
  dockerFrontend: "https://hub.docker.com/r/fadyy2k/mind-frontend",
};

const PIPELINE_STAGES = [
  {
    id: 1, icon: "⬆️", label: "Checkout",
    desc: "Jenkins pulls latest code from GitHub",
    color: "#64748b",
  },
  {
    id: 2, icon: "🔍", label: "Gitleaks",
    desc: "Secret scan — no leaks found",
    color: "#ef4444",
    result: "No leaks found ✓",
  },
  {
    id: 3, icon: "📊", label: "SonarQube",
    desc: "Static code analysis — quality gate passed",
    color: "#3b82f6",
    result: "Quality gate passed ✓",
  },
  {
    id: 4, icon: "🐳", label: "Docker Build",
    desc: "Build backend & frontend images",
    color: "#06b6d4",
    result: "2 images built ✓",
  },
  {
    id: 5, icon: "🛡️", label: "Trivy Scan",
    desc: "Container vulnerability scanning",
    color: "#8b5cf6",
    result: "Images scanned ✓",
  },
  {
    id: 6, icon: "📦", label: "DockerHub Push",
    desc: "Publish versioned images to registry",
    color: "#10b981",
    result: "Images published ✓",
  },
  {
    id: 7, icon: "🔄", label: "ArgoCD Sync",
    desc: "GitOps sync — manifests applied",
    color: "#f59e0b",
    result: "Synced + Healthy ✓",
  },
  {
    id: 8, icon: "☸️", label: "K3s Deploy",
    desc: "Pods running — app live",
    color: "#326ce5",
    result: "3/3 Running ✓",
  },
];

const TOOLS = [
  { name: "Jenkins", role: "CI/CD", icon: "⚙️", color: "#d24939", desc: "Pipeline orchestration — 10 automated stages" },
  { name: "Gitleaks", role: "Secret Scan", icon: "🔍", color: "#ef4444", desc: "Pre-build secret detection — no leaks found" },
  { name: "SonarQube", role: "Code Quality", icon: "📊", color: "#3b82f6", desc: "Static analysis — quality gate passed" },
  { name: "Trivy", role: "Vuln Scan", icon: "🛡️", color: "#8b5cf6", desc: "Docker image CVE scanning" },
  { name: "Docker", role: "Containers", icon: "🐳", color: "#06b6d4", desc: "Build & package images" },
  { name: "DockerHub", role: "Registry", icon: "📦", color: "#10b981", desc: "Versioned image storage" },
  { name: "K3s", role: "Kubernetes", icon: "☸️", color: "#326ce5", desc: "Lightweight certified K8s runtime" },
  { name: "ArgoCD", role: "GitOps", icon: "🔄", color: "#ef7b4d", desc: "Declarative self-healing deployment" },
];

const EC2_SERVERS = [
  {
    name: "EC2 #1 — CI/CD Server",
    hostname: "depi-jenkins-depi.duckdns.org",
    color: "#3b82f6",
    icon: "🖥️",
    services: [
      { name: "Jenkins", port: "8080", icon: "⚙️" },
      { name: "SonarQube", port: "9000", icon: "📊" },
      { name: "Docker Engine", port: "—", icon: "🐳" },
      { name: "Gitleaks", port: "Docker", icon: "🔍" },
      { name: "Trivy", port: "CLI", icon: "🛡️" },
    ],
  },
  {
    name: "EC2 #2 — Kubernetes Server",
    hostname: "depi-k3s-depi.duckdns.org",
    color: "#10b981",
    icon: "☸️",
    services: [
      { name: "K3s Cluster", port: "6443", icon: "☸️" },
      { name: "ArgoCD", port: "32000", icon: "🔄" },
      { name: "MIND Frontend", port: "30080", icon: "⚛️" },
      { name: "Go Backend", port: "ClusterIP", icon: "🔧" },
      { name: "PostgreSQL", port: "5432", icon: "🗄️" },
    ],
  },
];

const K8S_RESOURCES = [
  { kind: "Deployment", name: "mind-frontend", status: "1/1 Running", icon: "⚛️" },
  { kind: "Deployment", name: "mind-backend", status: "1/1 Running", icon: "🔧" },
  { kind: "Deployment", name: "postgres", status: "1/1 Running", icon: "🗄️" },
  { kind: "Service", name: "mind-frontend-service", port: "NodePort:30080", icon: "🌐" },
  { kind: "Service", name: "backend-service", port: "ClusterIP:8080", icon: "🔌" },
  { kind: "Service", name: "postgres", port: "ClusterIP:5432", icon: "🔌" },
  { kind: "PVC", name: "postgres-pvc", status: "Bound / 1Gi", icon: "💾" },
  { kind: "Secret", name: "postgres-secret", status: "Configured", icon: "🔐" },
];

const QA = [
  {
    q: "What is the project goal?",
    a: "To implement a complete DevSecOps pipeline — from a developer's git push to a live Kubernetes deployment — with automated secret scanning, code quality analysis, container vulnerability scanning, and GitOps self-healing at every stage.",
  },
  {
    q: "Why Jenkins?",
    a: "Jenkins is the industry standard for self-hosted CI/CD. It gives full control over the pipeline, secure credential management, and supports every tool in this stack. Running on our own EC2 demonstrates real infrastructure ownership.",
  },
  {
    q: "Why Gitleaks?",
    a: "One accidentally committed credential can be scraped from GitHub within minutes by bots. Gitleaks scans the full repository before any build begins. In this project, it confirmed the repository is clean — no leaks found.",
  },
  {
    q: "Why SonarQube?",
    a: "SonarQube integrates code quality into the pipeline so bugs and vulnerabilities are caught on every commit, not just at release time. The quality gate passed for both the Go backend and React frontend.",
  },
  {
    q: "Why Trivy in report-only mode?",
    a: "Blocking on CVEs requires organizational policy, exception workflows, and risk thresholds. For this demo, visibility is proven. In production, Trivy would fail the build on any unaccepted HIGH or CRITICAL vulnerability.",
  },
  {
    q: "Why K3s instead of full Kubernetes?",
    a: "K3s is fully certified Kubernetes — every manifest, command, and concept is identical to EKS or GKE. K3s runs on a single EC2 node, reducing cost while proving the full deployment model. Switching to EKS is a kubeconfig change only.",
  },
  {
    q: "How does ArgoCD self-healing work?",
    a: "ArgoCD continuously compares Git (desired state) to the cluster (actual state). When the frontend was manually scaled to 0 replicas with kubectl, ArgoCD detected the drift and restored it within 90 seconds — without any human intervention.",
  },
  {
    q: "What should be improved for production?",
    a: "TLS with cert-manager, Trivy blocking on HIGH/CRITICAL CVEs, HashiCorp Vault for secrets, multi-node Kubernetes, Ingress controller, Prometheus monitoring, Slack alerting, and image signing with Cosign.",
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function NavBar({ activeSection, onNav }) {
  const sections = ["Overview", "Architecture", "Pipeline", "Security", "Kubernetes", "Q&A"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(5,8,20,0.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(99,179,237,0.12)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 2rem", height: "60px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.4rem" }}>🚀</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#63b3ed", letterSpacing: "0.02em" }}>
          DEPI DevSecOps
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {sections.map(s => (
          <button key={s} onClick={() => onNav(s)}
            style={{
              background: activeSection === s ? "rgba(99,179,237,0.15)" : "transparent",
              border: activeSection === s ? "1px solid rgba(99,179,237,0.3)" : "1px solid transparent",
              color: activeSection === s ? "#63b3ed" : "rgba(255,255,255,0.5)",
              padding: "0.35rem 0.85rem", borderRadius: "6px", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 500, transition: "all 0.2s",
              fontFamily: "inherit",
            }}>
            {s}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Tag({ children, color = "#63b3ed" }) {
  return (
    <span style={{
      display: "inline-block", padding: "0.15rem 0.6rem",
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: "999px", color, fontSize: "0.72rem", fontWeight: 600,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

function Card({ children, style = {}, glow }) {
  return (
    <div style={{
      background: "rgba(10,15,35,0.7)",
      border: "1px solid rgba(99,179,237,0.12)",
      borderRadius: "16px",
      padding: "1.5rem",
      backdropFilter: "blur(12px)",
      boxShadow: glow ? `0 0 40px ${glow}22` : "0 4px 24px rgba(0,0,0,0.3)",
      transition: "all 0.3s",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
      <h2 style={{
        fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800,
        background: "linear-gradient(135deg, #63b3ed 0%, #9f7aea 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        margin: "0 0 0.75rem", fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: "-0.02em",
      }}>
        {children}
      </h2>
      {sub && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="overview" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "6rem 2rem 4rem", textAlign: "center", position: "relative" }}>
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
        <Tag color="#63b3ed">DEPI DevSecOps Project</Tag>

        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, margin: "1.5rem 0 1rem",
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.05,
        }}>
          <span style={{ color: "#fff" }}>MIND Notes App</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #63b3ed 0%, #9f7aea 60%, #ed64a6 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Full DevSecOps Pipeline
          </span>
        </h1>

        <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.6)", maxWidth: "650px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          From a developer's git push to a live, self-healing Kubernetes deployment —
          with automated secret scanning, code quality gates, and container vulnerability scanning at every step.
        </p>

        {/* Flow badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "3rem" }}>
          {["GitHub", "→", "Jenkins", "→", "Gitleaks", "→", "SonarQube", "→", "Docker", "→", "Trivy", "→", "DockerHub", "→", "ArgoCD", "→", "K3s"].map((item, i) => (
            <span key={i} style={{
              color: item === "→" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)",
              fontSize: item === "→" ? "1rem" : "0.85rem",
              fontWeight: item === "→" ? 400 : 700,
              background: item === "→" ? "transparent" : "rgba(99,179,237,0.08)",
              border: item === "→" ? "none" : "1px solid rgba(99,179,237,0.2)",
              padding: item === "→" ? "0" : "0.3rem 0.7rem",
              borderRadius: "6px",
              letterSpacing: "0.02em",
            }}>
              {item}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Live App", url: LINKS.app, primary: true, icon: "🚀" },
            { label: "Jenkins", url: LINKS.jenkins, icon: "⚙️" },
            { label: "GitHub", url: LINKS.github, icon: "📂" },
            { label: "Docs", url: LINKS.docs, icon: "📚" },
          ].map(btn => (
            <a key={btn.label} href={btn.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.65rem 1.5rem", borderRadius: "10px",
                background: btn.primary ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.05)",
                border: btn.primary ? "none" : "1px solid rgba(255,255,255,0.12)",
                color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem",
                boxShadow: btn.primary ? "0 4px 20px rgba(59,130,246,0.3)" : "none",
                transition: "all 0.2s",
              }}>
              <span>{btn.icon}</span> {btn.label}
            </a>
          ))}
        </div>

        {/* Status badges */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Pipeline: Active", color: "#10b981" },
            { label: "App: Live", color: "#10b981" },
            { label: "ArgoCD: Synced", color: "#3b82f6" },
            { label: "Gitleaks: Clean", color: "#10b981" },
            { label: "SonarQube: Passed", color: "#3b82f6" },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.3rem 0.9rem", borderRadius: "999px",
              background: `${s.color}15`, border: `1px solid ${s.color}35`,
              fontSize: "0.78rem", fontWeight: 600, color: s.color,
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, display: "inline-block", animation: "pulse 2s infinite" }} />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionTitle sub="Two AWS EC2 servers power the entire platform">Infrastructure Architecture</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {EC2_SERVERS.map(server => (
            <Card key={server.name} glow={server.color}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: `${server.color}22`, border: `1px solid ${server.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                }}>
                  {server.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>{server.name}</div>
                  <div style={{ fontSize: "0.75rem", color: server.color, fontFamily: "monospace" }}>{server.hostname}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {server.services.map(svc => (
                  <div key={svc.name} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{svc.icon}</span>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>{svc.name}</span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: server.color }}>{svc.port}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* DockerHub bridge */}
        <Card style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🐳</div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>DockerHub Registry — The Bridge</div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
            Jenkins (EC2 #1) builds and pushes images. K3s (EC2 #2) pulls and runs them. DockerHub is the shared image store.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={LINKS.dockerBackend} target="_blank" rel="noopener noreferrer"
              style={{ color: "#63b3ed", textDecoration: "none", fontFamily: "monospace", fontSize: "0.85rem", padding: "0.35rem 0.85rem", background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "6px" }}>
              fadyy2k/mind-backend
            </a>
            <a href={LINKS.dockerFrontend} target="_blank" rel="noopener noreferrer"
              style={{ color: "#63b3ed", textDecoration: "none", fontFamily: "monospace", fontSize: "0.85rem", padding: "0.35rem 0.85rem", background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "6px" }}>
              fadyy2k/mind-frontend
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}

function PipelineSection() {
  const [active, setActive] = useState(null);

  return (
    <section id="pipeline" style={{ padding: "6rem 2rem", background: "rgba(5,10,25,0.5)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionTitle sub="10 automated stages — from git push to live deployment">CI/CD Pipeline</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.id}
              onMouseEnter={() => setActive(stage.id)}
              onMouseLeave={() => setActive(null)}
              style={{
                cursor: "pointer", position: "relative",
                background: active === stage.id ? `${stage.color}18` : "rgba(10,15,35,0.6)",
                border: `1px solid ${active === stage.id ? stage.color + "55" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "14px", padding: "1.25rem",
                transition: "all 0.25s",
                boxShadow: active === stage.id ? `0 0 24px ${stage.color}30` : "none",
              }}>
              {/* Stage number */}
              <div style={{
                position: "absolute", top: "-10px", left: "1rem",
                background: stage.color, color: "#fff", borderRadius: "999px",
                fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                letterSpacing: "0.04em",
              }}>
                STAGE {stage.id}
              </div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem", marginTop: "0.25rem" }}>{stage.icon}</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.35rem", fontSize: "0.95rem" }}>{stage.label}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>{stage.desc}</div>
              {stage.result && (
                <div style={{ fontSize: "0.75rem", color: stage.color, fontWeight: 600 }}>
                  {stage.result}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connector arrow */}
        <div style={{ textAlign: "center", marginTop: "2rem", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
          Every stage runs automatically on every git push
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const tools = [
    {
      name: "Gitleaks", icon: "🔍", color: "#ef4444",
      what: "Secret / credential scanner",
      why: "Prevents accidental token/key exposure in source code",
      result: "No leaks found",
      status: "PASSED",
      mode: "Pre-build scan",
    },
    {
      name: "SonarQube", icon: "📊", color: "#3b82f6",
      what: "Static code analysis platform",
      why: "Catches bugs, vulnerabilities, code smells on every commit",
      result: "Quality gate passed",
      status: "PASSED",
      mode: "Pre-build analysis",
    },
    {
      name: "Trivy", icon: "🛡️", color: "#8b5cf6",
      what: "Container image vulnerability scanner",
      why: "Detects CVEs in Docker image layers before deployment",
      result: "Images scanned — report shown",
      status: "REPORT-ONLY",
      mode: "Pre-push scan",
    },
  ];

  return (
    <section id="security" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <SectionTitle sub="Security integrated at every pipeline stage — not added at the end">DevSecOps Security Gates</SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {tools.map(tool => (
            <Card key={tool.name} glow={tool.color}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "14px", flexShrink: 0,
                  background: `${tool.color}22`, border: `1px solid ${tool.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
                }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>{tool.name}</span>
                    <Tag color={tool.color}>{tool.mode}</Tag>
                    <span style={{
                      padding: "0.2rem 0.7rem", borderRadius: "999px",
                      background: tool.status === "PASSED" ? "#10b98120" : "#f59e0b20",
                      border: `1px solid ${tool.status === "PASSED" ? "#10b981" : "#f59e0b"}44`,
                      color: tool.status === "PASSED" ? "#10b981" : "#f59e0b",
                      fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
                    }}>
                      {tool.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>
                    <strong style={{ color: "rgba(255,255,255,0.8)" }}>What:</strong> {tool.what}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.4rem" }}>
                    <strong style={{ color: "rgba(255,255,255,0.8)" }}>Why:</strong> {tool.why}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: tool.color, fontWeight: 600 }}>
                    Result: {tool.result}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Security warning card */}
        <Card style={{ marginTop: "1.5rem", borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.05)" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: "#ef4444", marginBottom: "0.35rem" }}>Secrets Policy</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                No passwords, tokens, SSH keys, AWS credentials, or cloud secrets are stored in this repository, documentation, or the showcase app. All credentials are stored exclusively in Jenkins Credentials Manager and injected at runtime only.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function KubernetesSection() {
  return (
    <section id="kubernetes" style={{ padding: "6rem 2rem", background: "rgba(5,10,25,0.5)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionTitle sub="K3s cluster running on EC2 #2 — GitOps managed by ArgoCD">Kubernetes Deployment</SectionTitle>

        {/* ArgoCD status */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "ArgoCD Status", value: "Synced", color: "#10b981", icon: "✅" },
            { label: "App Health", value: "Healthy", color: "#10b981", icon: "💚" },
            { label: "Self-Healing", value: "Proven", color: "#3b82f6", icon: "🔄" },
            { label: "Namespace", value: "mind", color: "#9f7aea", icon: "☸️" },
            { label: "Pods Running", value: "3 / 3", color: "#10b981", icon: "🟢" },
            { label: "PVC", value: "Bound", color: "#10b981", icon: "💾" },
          ].map(stat => (
            <Card key={stat.label} style={{ textAlign: "center", padding: "1.25rem" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.35rem" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: stat.color, marginBottom: "0.25rem" }}>{stat.value}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Resources table */}
        <Card>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem", fontSize: "1rem" }}>
            Kubernetes Resources — namespace: <span style={{ color: "#9f7aea", fontFamily: "monospace" }}>mind</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {K8S_RESOURCES.map(r => (
              <div key={r.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.6rem 0.85rem", background: "rgba(255,255,255,0.025)",
                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)",
                flexWrap: "wrap", gap: "0.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1rem" }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{r.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{r.kind}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: "0.78rem", fontWeight: 600,
                  color: r.status?.includes("Running") || r.status?.includes("Bound") || r.status?.includes("Synced") || r.status === "Configured" ? "#10b981" : "#63b3ed",
                  fontFamily: "monospace",
                }}>
                  {r.status || r.port}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Self-healing proof */}
        <Card style={{ marginTop: "1.5rem", borderColor: "rgba(16,185,129,0.25)" }}>
          <div style={{ fontWeight: 700, color: "#10b981", marginBottom: "0.75rem", fontSize: "1rem" }}>
            🔄 Self-Healing Test — Proven
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#63b3ed", background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "0.85rem", marginBottom: "0.85rem", border: "1px solid rgba(99,179,237,0.15)" }}>
            $ kubectl scale deployment mind-frontend -n mind --replicas=0
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { icon: "1️⃣", text: "Frontend pod terminated immediately", color: "#ef4444" },
              { icon: "2️⃣", text: "ArgoCD detected drift — cluster != Git state", color: "#f59e0b" },
              { icon: "3️⃣", text: "ArgoCD restored deployment to 1 replica (~90 seconds)", color: "#3b82f6" },
              { icon: "4️⃣", text: "Frontend returned to 1/1 Running", color: "#10b981" },
              { icon: "5️⃣", text: "ArgoCD: Synced + Healthy", color: "#10b981" },
            ].map(step => (
              <div key={step.text} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem" }}>{step.icon}</span>
                <span style={{ fontSize: "0.85rem", color: step.color }}>{step.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function QASection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="qa" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <SectionTitle sub="Questions a professor or evaluator is likely to ask — with complete answers">Professor Q&A</SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {QA.map((item, i) => (
            <div key={i}
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: open === i ? "rgba(99,179,237,0.08)" : "rgba(10,15,35,0.6)",
                border: `1px solid ${open === i ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.92rem", color: open === i ? "#63b3ed" : "rgba(255,255,255,0.85)" }}>
                  Q{i + 1}: {item.q}
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.1rem", flexShrink: 0, marginLeft: "1rem" }}>
                  {open === i ? "▲" : "▼"}
                </span>
              </div>
              {open === i && (
                <div style={{ padding: "0 1.25rem 1rem", borderTop: "1px solid rgba(99,179,237,0.15)" }}>
                  <p style={{ margin: "0.75rem 0 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* All links */}
        <Card style={{ marginTop: "3rem", textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>All Live Resources</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {[
              { label: "MIND App", url: LINKS.app, color: "#10b981" },
              { label: "API Health", url: LINKS.health, color: "#10b981" },
              { label: "Jenkins", url: LINKS.jenkins, color: "#d24939" },
              { label: "ArgoCD", url: LINKS.argocd, color: "#ef7b4d" },
              { label: "SonarQube", url: LINKS.sonarqube, color: "#3b82f6" },
              { label: "DockerHub Backend", url: LINKS.dockerBackend, color: "#06b6d4" },
              { label: "DockerHub Frontend", url: LINKS.dockerFrontend, color: "#06b6d4" },
              { label: "GitHub Repo", url: LINKS.github, color: "#9f7aea" },
              { label: "Documentation", url: LINKS.docs, color: "#9f7aea" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{
                  color: link.color, textDecoration: "none", fontSize: "0.82rem", fontWeight: 600,
                  padding: "0.35rem 0.85rem",
                  background: `${link.color}12`, border: `1px solid ${link.color}30`,
                  borderRadius: "8px", transition: "all 0.2s",
                }}>
                {link.label} ↗
              </a>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("Overview");

  const scrollTo = (id) => {
    setActiveSection(id);
    const map = { Overview: "overview", Architecture: "architecture", Pipeline: "pipeline", Security: "security", Kubernetes: "kubernetes", "Q&A": "qa" };
    const el = document.getElementById(map[id]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    // Import Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020714 0%, #050c1e 40%, #080d24 100%)",
      color: "#fff",
      fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        html { scroll-behavior: smooth; }
        a:hover { opacity: 0.85; }
        section { scroll-margin-top: 60px; }
      `}</style>

      <NavBar activeSection={activeSection} onNav={scrollTo} />
      <HeroSection />
      <ArchitectureSection />
      <PipelineSection />
      <SecuritySection />
      <KubernetesSection />
      <QASection />

      <footer style={{
        textAlign: "center", padding: "3rem 2rem",
        borderTop: "1px solid rgba(99,179,237,0.08)",
        color: "rgba(255,255,255,0.25)", fontSize: "0.82rem",
      }}>
        DEPI DevSecOps Project — MIND Notes App | Full pipeline: GitHub → Jenkins → Gitleaks → SonarQube → Docker → Trivy → DockerHub → ArgoCD → K3s
      </footer>
    </div>
  );
}
