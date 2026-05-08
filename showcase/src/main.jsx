import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Code2,
  Container,
  Database,
  ExternalLink,
  GitBranch,
  Layers,
  Lock,
  Network,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./styles.css";

const BASE = "/depi-mind-app-v2/";

const liveLinks = [
  ["GitHub Repository", "https://github.com/fadyy2k/depi-mind-app-v2", "Public"],
  ["MkDocs Docs", "https://fadyy2k.github.io/depi-mind-app-v2/", "Public"],
  ["Jenkins", "http://depi-jenkins-depi.duckdns.org:8080", "No login required"],
  ["MIND App", "http://depi-k3s-depi.duckdns.org:30080", "demo@example.com / demo123456"],
  ["API Health", "http://depi-k3s-depi.duckdns.org:30080/api/health", "Public"],
  ["ArgoCD", "http://depi-k3s-depi.duckdns.org:32000", "Demo credentials only"],
  ["SonarQube", "http://depi-jenkins-depi.duckdns.org:9000", "Demo credentials only"]
];

const tools = [
  ["GitHub", "Source code and Kubernetes manifests", "Source Control"],
  ["Jenkins", "CI pipeline orchestration", "CI"],
  ["Gitleaks", "Repository secret scanning", "Security"],
  ["SonarQube", "Static code quality analysis", "Quality"],
  ["Docker", "Backend and frontend image builds", "Build"],
  ["Trivy", "Container vulnerability scanning", "Security"],
  ["DockerHub", "Image registry and publishing", "Registry"],
  ["ArgoCD", "GitOps sync and self-healing", "CD"],
  ["K3s", "Lightweight Kubernetes runtime", "Runtime"]
];

const pipelineStages = [
  ["Checkout", "Pull source code from GitHub"],
  ["Show Workspace", "Validate repository layout"],
  ["Gitleaks", "Scan for leaked secrets"],
  ["SonarQube", "Run static code analysis"],
  ["Build Backend", "Build Go API image"],
  ["Build Frontend", "Build React/Nginx image"],
  ["Trivy", "Scan container images"],
  ["DockerHub Login", "Authenticate using Jenkins credentials"],
  ["Push Images", "Publish images"],
  ["Logout", "Clean Docker session"]
];

const buildTrend = [
  { build: "#3", seconds: 39 },
  { build: "#5", seconds: 65 },
  { build: "#8", seconds: 88 }
];

const coverageData = [
  { name: "CI", value: 100 },
  { name: "Secrets", value: 100 },
  { name: "Code", value: 100 },
  { name: "Images", value: 100 },
  { name: "K8s", value: 100 },
  { name: "GitOps", value: 100 }
];

const scanData = [
  { name: "Gitleaks", value: 0 },
  { name: "SonarQube", value: 1 },
  { name: "Trivy Backend", value: 15 },
  { name: "Trivy Frontend", value: 1 }
];

const k8sData = [
  { name: "Deployments", value: 3 },
  { name: "Services", value: 3 },
  { name: "PVC", value: 1 },
  { name: "Namespace", value: 1 },
  { name: "ArgoCD App", value: 1 }
];

const screenshots = [
  ["GitHub Repository", "screenshots/github-repo.png"],
  ["MkDocs Documentation", "screenshots/mkdocs-home.png"],
  ["Jenkins Dashboard", "screenshots/jenkins-dashboard.png"],
  ["Jenkins Build #8", "screenshots/jenkins-build-8-success.png"],
  ["Gitleaks Console", "screenshots/jenkins-gitleaks-console.png"],
  ["SonarQube Console", "screenshots/jenkins-sonarqube-console.png"],
  ["SonarQube Dashboard", "screenshots/sonarqube-dashboard.png"],
  ["Trivy Console", "screenshots/jenkins-trivy-console.png"],
  ["DockerHub Backend", "screenshots/dockerhub-backend.png"],
  ["DockerHub Frontend", "screenshots/dockerhub-frontend.png"],
  ["K3s Pods", "screenshots/k3s-pods.png"],
  ["MIND App", "screenshots/mind-app.png"],
  ["API Health", "screenshots/api-health.png"],
  ["ArgoCD Synced", "screenshots/argocd-synced.png"],
  ["ArgoCD Self-Heal", "screenshots/argocd-self-heal.png"]
];

const qna = [
  ["What is the main goal?", "To prove a complete DevSecOps pipeline from GitHub to Kubernetes, including CI, security scanning, image publishing, GitOps deployment, and self-healing."],
  ["Why two EC2 servers?", "One EC2 is for CI/CD and security scanning, while the second EC2 runs the production-like Kubernetes environment."],
  ["Why Jenkins?", "Jenkins makes each pipeline stage visible and integrates cleanly with Docker-based tools."],
  ["Why Gitleaks?", "It detects leaked secrets before build and deployment."],
  ["Why SonarQube?", "It provides code quality and maintainability visibility."],
  ["Why Trivy?", "It scans Docker images for vulnerabilities before deployment."],
  ["Why K3s?", "K3s is lightweight and cost-effective while still demonstrating Kubernetes concepts."],
  ["Why ArgoCD?", "ArgoCD implements GitOps, syncs the cluster with Git, and repairs drift automatically."],
  ["How was self-healing tested?", "The frontend deployment was scaled to zero replicas. ArgoCD detected drift and restored the desired state from Git."],
  ["What would be improved for production?", "HTTPS, private networking, managed secrets, monitoring, logging, backups, stricter security gates, and ingress would be added."]
];

function A({ href, children, className = "" }) {
  return <a className={`link ${className}`} href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={14} /></a>;
}

function Header() {
  return (
    <header className="topbar">
      <div className="brand"><span>Δ</span><strong>DEPI Showcase</strong></div>
      <nav>
        <a href="#architecture">Architecture</a>
        <a href="#pipeline">Pipeline</a>
        <a href="#security">Security</a>
        <a href="#screenshots">Evidence</a>
        <a href="#qna">Q&A</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={15}/> Premium DevSecOps Presentation Portal</p>
        <h1>DEPI DevSecOps Project — MIND Notes App</h1>
        <p>
          A visually documented AWS DevSecOps project covering Jenkins CI, Gitleaks,
          SonarQube, Docker, Trivy, DockerHub, K3s Kubernetes, and ArgoCD GitOps.
        </p>
        <div className="hero-actions">
          <A className="primary" href="https://github.com/fadyy2k/depi-mind-app-v2">GitHub Repo</A>
          <A href="https://fadyy2k.github.io/depi-mind-app-v2/">MkDocs Docs</A>
          <A href="http://depi-k3s-depi.duckdns.org:30080">Live App</A>
        </div>
      </div>

      <div className="orbit-card">
        <div className="orbit">
          {tools.slice(0, 8).map((tool, i) => <span key={tool[0]} style={{"--i": i}}>{tool[0]}</span>)}
          <div className="orbit-core">MIND<br/>App</div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats">
      {[
        ["2", "AWS EC2 Servers", "CI/CD separated from runtime"],
        ["10", "Jenkins Stages", "Full build and scan pipeline"],
        ["3", "Security Layers", "Gitleaks, SonarQube, Trivy"],
        ["100%", "GitOps Proof", "ArgoCD restored drift"]
      ].map(([num, title, text]) => (
        <div className="stat" key={title}>
          <strong>{num}</strong>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </section>
  );
}

function Links() {
  return (
    <section className="section">
      <div className="section-title"><h2>Live Demo Links</h2><p>Everything needed for the live professor demo.</p></div>
      <div className="table-card">
        <table>
          <thead><tr><th>Service</th><th>URL</th><th>Access</th></tr></thead>
          <tbody>
            {liveLinks.map(([name, url, access]) => (
              <tr key={name}><td>{name}</td><td><A href={url}>{url}</A></td><td>{access}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Toolchain() {
  return (
    <section className="section">
      <div className="section-title"><h2>Toolchain Map</h2><p>The complete DevSecOps path from source code to running app.</p></div>
      <div className="toolchain">
        {tools.map(([name, desc, type], index) => (
          <React.Fragment key={name}>
            <div className="tool-card">
              <span>{type}</span>
              <strong>{name}</strong>
              <p>{desc}</p>
            </div>
            {index < tools.length - 1 && <ArrowRight className="tool-arrow" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function Architecture() {
  const jenkins = [
    ["Jenkins", "Pipeline orchestration on port 8080"],
    ["Docker Engine", "Builds backend and frontend images"],
    ["Gitleaks", "Secret scanning before build"],
    ["SonarQube", "Code quality on port 9000"],
    ["Trivy", "Container image vulnerability scanning"],
    ["DuckDNS", "Stable Jenkins demo hostname"]
  ];

  const k3s = [
    ["K3s Kubernetes", "Single-node cluster on AWS EC2"],
    ["ArgoCD", "GitOps sync on NodePort 32000"],
    ["Frontend", "React/Nginx on NodePort 30080"],
    ["Backend", "Go API with health endpoint"],
    ["PostgreSQL", "Database pod with PVC"],
    ["DuckDNS", "Stable app and ArgoCD demo hostname"]
  ];

  return (
    <section id="architecture" className="section">
      <div className="section-title"><h2>Full EC2 Architecture</h2><p>What is inside each EC2 server and how both servers work together.</p></div>

      <div className="architecture-grid">
        <Ec2 title="EC2 #1 — depi-jenkins-server" subtitle="CI/CD, Security Scanning, Docker Builds" services={jenkins} tone="blue" />
        <div className="connector">
          <div><b>1</b> GitHub push triggers Jenkins</div>
          <div><b>2</b> Jenkins scans, builds, and pushes images</div>
          <div><b>3</b> ArgoCD watches Git manifests</div>
          <div><b>4</b> K3s pulls DockerHub images</div>
        </div>
        <Ec2 title="EC2 #2 — depi-k3s-server" subtitle="Kubernetes Runtime and GitOps" services={k3s} tone="green" />
      </div>

      <div className="workflow-panel">
        <WorkflowRow items={["Developer", "GitHub", "Jenkins", "DockerHub"]} labels={["push", "checkout", "publish"]} />
        <WorkflowRow items={["Git Manifests", "ArgoCD", "K3s Cluster", "MIND App"]} labels={["watched by", "sync", "runs"]} />
        <WorkflowRow items={["Manual Drift", "ArgoCD", "Healthy State"]} labels={["detected", "restored"]} special />
      </div>
    </section>
  );
}

function Ec2({ title, subtitle, services, tone }) {
  return (
    <div className={`ec2 ${tone}`}>
      <div className="ec2-head"><Server/><span>{title}</span><p>{subtitle}</p></div>
      <div className="ec2-services">
        {services.map(([name, text]) => <div key={name}><strong>{name}</strong><small>{text}</small></div>)}
      </div>
    </div>
  );
}

function WorkflowRow({ items, labels, special }) {
  return (
    <div className="workflow-row">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          <span className={special && i === 0 ? "warn" : special && i === items.length - 1 ? "ok" : ""}>{item}</span>
          {labels[i] && <em>{labels[i]}</em>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Pipeline() {
  return (
    <section id="pipeline" className="section">
      <div className="section-title"><h2>CI/CD Pipeline</h2><p>Jenkins stages explained in a clean presentation format.</p></div>
      <div className="timeline">
        {pipelineStages.map(([name, desc], i) => (
          <div className="timeline-item" key={name}><b>{String(i + 1).padStart(2, "0")}</b><div><h3>{name}</h3><p>{desc}</p></div></div>
        ))}
      </div>
    </section>
  );
}

function Charts() {
  return (
    <section id="security" className="section">
      <div className="section-title"><h2>Security, Quality & Runtime Charts</h2><p>Visual proof of coverage across the project lifecycle.</p></div>
      <div className="charts">
        <ChartCard title="Build Duration Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={buildTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="build"/><YAxis/><Tooltip/><Line type="monotone" dataKey="seconds" stroke="#38bdf8" strokeWidth={4}/></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="DevSecOps Coverage">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={coverageData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22d3ee"/></AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Security Scan Visibility">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scanData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value">{scanData.map((_, i) => <Cell key={i} fill={["#22c55e","#60a5fa","#fb923c","#a78bfa"][i]}/>)}</Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Kubernetes Resources">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Tooltip/><Pie data={k8sData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={54}>{k8sData.map((_, i) => <Cell key={i} fill={["#38bdf8","#22c55e","#facc15","#a78bfa","#fb7185"][i]}/>)}</Pie></PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({ title, children }) {
  return <div className="chart-card"><h3>{title}</h3>{children}</div>;
}

function Screenshots() {
  return (
    <section id="screenshots" className="section">
      <div className="section-title"><h2>Evidence Gallery</h2><p>Real screenshots from the project documentation.</p></div>
      <div className="gallery">
        {screenshots.map(([title, file]) => (
          <figure key={title}>
            <img src={`${BASE}${file}`} alt={title} />
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Qna() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? qna.filter(([a,b]) => `${a} ${b}`.toLowerCase().includes(q)) : qna;
  }, [query]);

  return (
    <section id="qna" className="section">
      <div className="section-title"><h2>Professor Q&A</h2><p>Searchable answers for the most likely discussion questions.</p></div>
      <div className="search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ArgoCD, Jenkins, SonarQube, Trivy, K3s..." /></div>
      <div className="qna">
        {filtered.map(([q, a]) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <ShieldCheck/> This is a lab/demo environment. Production would require HTTPS, private networking, managed secrets, backups, monitoring, logging, and stricter security gates.
    </footer>
  );
}

function App() {
  return (
    <>
      <Header/>
      <Hero/>
      <Stats/>
      <Links/>
      <Toolchain/>
      <Architecture/>
      <Pipeline/>
      <Charts/>
      <Screenshots/>
      <Qna/>
      <Footer/>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
