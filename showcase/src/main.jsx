import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
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

const liveLinks = [
  ["GitBranch Repository", "https://GitBranch.com/fadyy2k/depi-mind-app-v2", "Public"],
  ["MkDocs Site", "https://fadyy2k.GitBranch.io/depi-mind-app-v2/", "Public"],
  ["Jenkins", "http://depi-jenkins-depi.duckdns.org:8080", "No login required"],
  ["MIND App", "http://depi-k3s-depi.duckdns.org:30080", "demo@example.com / demo123456"],
  ["API Health", "http://depi-k3s-depi.duckdns.org:30080/api/health", "Public health endpoint"],
  ["ArgoCD", "http://depi-k3s-depi.duckdns.org:32000", "Admin login available during live demo only"],
  ["SonarQube", "http://depi-jenkins-depi.duckdns.org:9000", "Admin login available during live demo only"],
  ["DockerHub Backend", "https://hub.docker.com/r/fadyy2k/mind-backend", "Public image repository"],
  ["DockerHub Frontend", "https://hub.docker.com/r/fadyy2k/mind-frontend", "Public image repository"]
];

const pipelineStages = [
  ["Checkout", "GitBranch â€” Pull source code from repository"],
  ["Show Workspace", "Jenkins â€” Validate workspace and folder structure"],
  ["Gitleaks Secret Scan", "Gitleaks â€” Detect leaked secrets before build"],
  ["SonarQube Code Scan", "SonarQube â€” Analyze code quality and maintainability"],
  ["Build Backend Image", "Docker â€” Build Go backend image"],
  ["Build Frontend Image", "Docker â€” Build React/Nginx frontend image"],
  ["Trivy Image Scan", "Trivy â€” Scan Docker images for vulnerabilities"],
  ["DockerHub Login", "DockerHub â€” Authenticate using Jenkins credentials"],
  ["Push Images", "DockerHub â€” Push versioned and latest image tags"],
  ["Docker Logout", "Jenkins â€” Clean registry session"]
];

const buildTrend = [
  { build: "#3", seconds: 39 },
  { build: "#5", seconds: 65 },
  { build: "#8", seconds: 88 }
];

const securityData = [
  { name: "Gitleaks", value: 0 },
  { name: "SonarQube", value: 1 },
  { name: "Trivy Backend", value: 15 },
  { name: "Trivy Frontend", value: 1 }
];

const coverageData = [
  { name: "Secret Scan", value: 100 },
  { name: "Code Quality", value: 100 },
  { name: "Image Scan", value: 100 },
  { name: "Kubernetes", value: 100 },
  { name: "GitOps", value: 100 },
  { name: "Docs", value: 100 }
];

const k8sResources = [
  { name: "Secrets", value: 1 },
  { name: "PVC", value: 1 },
  { name: "Deployments", value: 3 },
  { name: "Services", value: 3 },
  { name: "Namespace", value: 1 },
  { name: "ArgoCD App", value: 1 }
];

const screenshots = [
  "GitBranch repository with README and docs",
  "MkDocs GitBranch Pages website",
  "Jenkins dashboard",
  "Jenkins Build #8 success",
  "Jenkins Gitleaks console output",
  "Jenkins SonarQube console output",
  "Jenkins Trivy console output",
  "DockerHub backend tags",
  "DockerHub frontend tags",
  "K3s pods and services",
  "MIND app running",
  "API health endpoint",
  "ArgoCD synced/healthy tree",
  "ArgoCD self-healing proof",
  "SonarQube dashboard"
];

const qna = [
  ["What is the main goal of the project?", "To demonstrate a full DevSecOps delivery pipeline from source code to production-like Kubernetes deployment, including CI, security scanning, image publishing, GitOps deployment, and self-healing validation."],
  ["Why did you use Jenkins?", "Jenkins is used as the CI automation server to pull code, run security and quality scans, build Docker images, and push images to DockerHub."],
  ["Why did you use Gitleaks?", "Gitleaks checks the repository for accidentally committed secrets before the application is built or deployed."],
  ["Why did you use SonarQube?", "SonarQube provides static code analysis, maintainability feedback, reliability checks, and quality gate visibility."],
  ["Why is Trivy in report-only mode?", "For the demo, Trivy shows vulnerability visibility without blocking the pipeline. In production, the same stage can be changed to fail the build on HIGH or CRITICAL findings."],
  ["Why did you use DockerHub?", "DockerHub acts as the image registry where versioned backend and frontend images are stored and pulled by Kubernetes."],
  ["Why K3s instead of full Kubernetes or EKS?", "K3s is lightweight and suitable for a cost-effective single-node lab on EC2 while still demonstrating real Kubernetes concepts."],
  ["What does ArgoCD add?", "ArgoCD continuously syncs Kubernetes manifests from Git and restores the desired state if manual drift occurs."],
  ["How did you prove self-healing?", "The frontend deployment was manually scaled to zero replicas. ArgoCD detected the drift and restored the deployment back to the desired state from Git."],
  ["Why did you use DuckDNS?", "DuckDNS provides stable demo URLs even if AWS public IP addresses change after stopping and starting EC2 instances."],
  ["What would you improve for production?", "Use HTTPS, private networking, managed secrets, managed database or backups, monitoring, logging, stricter security gates, and stronger access controls."]
];

function ExternalAnchor({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="external-link">
      {children}
      <ExternalLink size={13} />
    </a>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">A</span>
        <strong>DEPI DevSecOps</strong>
      </div>
      <nav>
        <a href="#architecture">Architecture</a>
        <a href="#pipeline">Pipeline</a>
        <a href="#security">Security</a>
        <a href="#qna">Professor Q&A</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">AWS â€¢ Jenkins â€¢ Kubernetes â€¢ GitOps â€¢ DevSecOps</p>
        <h1>DEPI DevSecOps Project â€” MIND Notes App</h1>
        <p className="hero-copy">
          A complete DevSecOps workflow deployed on AWS EC2 using Jenkins CI, Docker images,
          security scanning, DockerHub registry, K3s Kubernetes, and ArgoCD GitOps self-healing.
        </p>
        <div className="hero-actions">
          <ExternalAnchor href="https://GitBranch.com/fadyy2k/depi-mind-app-v2">GitBranch Repo</ExternalAnchor>
          <ExternalAnchor href="https://fadyy2k.GitBranch.io/depi-mind-app-v2/">MkDocs Site</ExternalAnchor>
          <ExternalAnchor href="http://depi-k3s-depi.duckdns.org:30080">Live App</ExternalAnchor>
        </div>
      </div>

      <div className="hero-panel">
        <h3>Final Toolchain</h3>
        <p>GitBranch â†’ Jenkins â†’ Gitleaks â†’ SonarQube â†’ Docker Build â†’ Trivy â†’ DockerHub â†’ ArgoCD â†’ K3s Kubernetes</p>
        <div className="chip-row">
          {["GitBranch", "Jenkins", "Gitleaks", "SonarQube", "Docker", "Trivy", "DockerHub", "ArgoCD", "K3s"].map((item) => (
            <span className="chip" key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section className="section">
      <h2><Layers size={24} /> Project Overview</h2>
      <div className="overview-grid">
        <div className="mini-card"><Zap /><h3>Frontend</h3><p>React app served by Nginx</p></div>
        <div className="mini-card"><Server /><h3>Backend</h3><p>Go API with health endpoint</p></div>
        <div className="mini-card"><Database /><h3>Database</h3><p>PostgreSQL with PVC persistence</p></div>
      </div>

      <div className="card">
        <h3>Live Services</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Service</th><th>URL</th><th>Access</th></tr>
            </thead>
            <tbody>
              {liveLinks.map(([service, url, access]) => (
                <tr key={service}>
                  <td>{service}</td>
                  <td><ExternalAnchor href={url}>{url}</ExternalAnchor></td>
                  <td>{access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="security-note">Security note: do not publish real admin passwords, private keys, tokens, or cloud credentials in a public repository or public Vercel/GitBranch Pages app.</p>
      </div>
    </section>
  );
}

function Ec2ArchitectureDiagram() {
  const leftServices = [
    ["Jenkins", "Port 8080 â€” CI pipeline automation"],
    ["Docker Engine", "Builds backend and frontend images"],
    ["Gitleaks", "Scans repository for leaked secrets before build"],
    ["SonarQube", "Port 9000 â€” static code analysis and quality gate"],
    ["Trivy", "Scans Docker images for vulnerabilities"],
    ["MkDocs / GitBranch Pages", "Documentation generated and published from repo"]
  ];

  const rightServices = [
    ["K3s Kubernetes", "Single-node Kubernetes cluster"],
    ["ArgoCD", "Port 32000 â€” GitOps sync and self-healing"],
    ["MIND Frontend", "React + Nginx exposed on NodePort 30080"],
    ["MIND Backend", "Go API service with /api/health endpoint"],
    ["PostgreSQL", "Database pod with PVC persistent storage"],
    ["DuckDNS", "Dynamic DNS for stable demo access"]
  ];

  return (
    <section id="architecture" className="section">
      <h2><Network size={24} /> Full EC2 Architecture & How Everything Works Together</h2>
      <div className="card diagram-card">
        <p className="diagram-intro">
          This visual explains the two-server architecture. The first EC2 server handles CI/CD,
          scanning, image building, and documentation. The second EC2 server runs the Kubernetes
          runtime, ArgoCD, PostgreSQL, backend, and frontend.
        </p>

        <div className="diagram-grid">
          <div className="ec2-box jenkins-ec2">
            <div className="ec2-header">
              <span className="ec2-badge">EC2 #1</span>
              <h3>depi-jenkins-server</h3>
              <p>CI/CD, Security Scanning, Docker Builds, Documentation</p>
            </div>
            <div className="service-list">
              {leftServices.map(([title, text]) => <ServiceItem key={title} title={title} text={text} />)}
            </div>
          </div>

          <div className="connection-column">
            {[
              "GitBranch push triggers Jenkins pipeline",
              "Jenkins builds and pushes Docker images",
              "ArgoCD watches GitBranch Kubernetes manifests",
              "K3s pulls images from DockerHub and runs app"
            ].map((text, index) => (
              <div className="flow-arrow" key={text}><span>{index + 1}</span>{text}</div>
            ))}
          </div>

          <div className="ec2-box k3s-ec2">
            <div className="ec2-header">
              <span className="ec2-badge">EC2 #2</span>
              <h3>depi-k3s-server</h3>
              <p>Kubernetes Runtime, GitOps, Application Services</p>
            </div>
            <div className="service-list">
              {rightServices.map(([title, text]) => <ServiceItem key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>

        <div className="workflow-map">
          <h3>End-to-End Workflow</h3>
          <WorkflowRow nodes={["Developer", "GitBranch Repo", "Jenkins", "DockerHub"]} labels={["push code", "checkout", "scan + build"]} />
          <WorkflowRow nodes={["GitBranch k8s Manifests", "ArgoCD", "K3s Cluster", "MIND App"]} labels={["watched by", "syncs desired state", "runs"]} />
          <WorkflowRow nodes={["Manual Drift", "ArgoCD", "Healthy State"]} labels={["detected by", "restores"]} special />
        </div>

        <div className="explain-grid">
          <div><h3>Why Two EC2 Servers?</h3><p>The Jenkins EC2 separates CI/CD and scanning workloads from the runtime environment. The K3s EC2 acts as the production-like Kubernetes environment where the application runs.</p></div>
          <div><h3>How They Work Together</h3><p>Jenkins builds and publishes images to DockerHub. ArgoCD applies Kubernetes manifests from GitBranch, and K3s pulls the required images to run the frontend, backend, and PostgreSQL services.</p></div>
          <div><h3>How Self-Healing Works</h3><p>When the frontend deployment was manually scaled to zero replicas, ArgoCD detected that the live state no longer matched Git and restored the deployment automatically.</p></div>
        </div>
      </div>
    </section>
  );
}

function ServiceItem({ title, text }) {
  return <div className="service-item"><strong>{title}</strong><span>{text}</span></div>;
}

function WorkflowRow({ nodes, labels, special }) {
  return (
    <div className="workflow-row">
      {nodes.map((node, i) => (
        <React.Fragment key={`${node}-${i}`}>
          <div className={`workflow-node ${special && i === 0 ? "warning-node" : ""} ${special && i === nodes.length - 1 ? "success-node" : ""}`}>{node}</div>
          {labels[i] && <div className="workflow-line">{labels[i]}</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function ArchitectureSummary() {
  const stack = [
    ["Frontend", "React + Nginx", "Running"],
    ["Backend", "Go API", "Running"],
    ["Database", "PostgreSQL 15", "Running"],
    ["CI", "Jenkins", "Running"],
    ["Secret Scan", "Gitleaks", "No leaks found"],
    ["Code Quality", "SonarQube", "Quality gate passed"],
    ["Image Scan", "Trivy", "Report-only mode"],
    ["Registry", "DockerHub", "Images pushed"],
    ["Kubernetes", "K3s", "Ready"],
    ["GitOps", "ArgoCD", "Synced / Healthy"],
    ["DNS", "DuckDNS", "Dynamic demo URLs"]
  ];

  return (
    <section className="section">
      <h2><Server size={24} /> Architecture & Infrastructure Summary</h2>
      <div className="chain">
        {["GitBranch", "Jenkins", "Gitleaks", "SonarQube", "Docker Build", "Trivy", "DockerHub", "ArgoCD", "K3s", "MIND App"].map((item) => (
          <React.Fragment key={item}><span>{item}</span><b>â†’</b></React.Fragment>
        ))}
      </div>

      <div className="server-grid">
        <div className="server-card">
          <Server />
          <h3>depi-jenkins-server</h3>
          <p>CI, Docker builds, Gitleaks, SonarQube, Trivy, DockerHub push</p>
          <dl><dt>Public DNS</dt><dd>depi-jenkins-depi.duckdns.org</dd><dt>Ports</dt><dd>8080, 9000</dd></dl>
        </div>
        <div className="server-card">
          <Server />
          <h3>depi-k3s-server</h3>
          <p>K3s Kubernetes, ArgoCD, MIND App runtime</p>
          <dl><dt>Public DNS</dt><dd>depi-k3s-depi.duckdns.org</dd><dt>Ports</dt><dd>30080, 32000, 6443</dd></dl>
        </div>
      </div>

      <div className="card">
        <h3>Application Stack</h3>
        <div className="stack-grid">
          {stack.map(([layer, tech, status]) => (
            <div className="stack-item" key={layer}>
              <span>{layer}</span>
              <strong>{tech}</strong>
              <em>{status}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section id="pipeline" className="section">
      <h2><GitBranch size={24} /> CI/CD Pipeline</h2>
      <div className="timeline">
        {pipelineStages.map(([title, text], index) => (
          <div className="timeline-item" key={title}>
            <span className="step">{index + 1}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Build Duration Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={buildTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="build" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="seconds" stroke="#38bdf8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>DevSecOps Coverage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coverageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#38bdf8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="section">
      <h2><ShieldCheck size={24} /> Security & Quality Gates</h2>
      <div className="overview-grid">
        <div className="mini-card"><Lock /><h3>Gitleaks</h3><p>Pre-build secret detection. Latest proof: no leaks found.</p></div>
        <div className="mini-card"><Activity /><h3>SonarQube</h3><p>Static code analysis completed successfully. Quality gate passed.</p></div>
        <div className="mini-card"><Container /><h3>Trivy</h3><p>Docker image vulnerability scanning in report-only mode.</p></div>
      </div>

      <div className="chart-card full">
        <h3>Security Scan Results</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={securityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {securityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#22c55e", "#60a5fa", "#f97316", "#a78bfa"][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Kubernetes() {
  const checks = [
    ["K3s node", "Ready"],
    ["Backend pod", "1/1 Running"],
    ["Frontend pod", "1/1 Running"],
    ["PostgreSQL pod", "1/1 Running"],
    ["ArgoCD app", "Synced / Healthy"],
    ["API health", "200 OK"],
    ["Gitleaks", "No leaks found"],
    ["SonarQube", "Analysis successful / Quality gate passed"]
  ];

  return (
    <section className="section">
      <h2><Workflow size={24} /> Kubernetes & GitOps</h2>
      <div className="k8s-grid">
        <div className="chart-card">
          <h3>Kubernetes Resources</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip />
              <Pie data={k8sResources} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55}>
                {k8sResources.map((_, i) => <Cell key={i} fill={["#38bdf8", "#22c55e", "#f97316", "#a78bfa", "#facc15", "#fb7185"][i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Final Validation</h3>
          <div className="check-list">
            {checks.map(([name, status]) => (
              <div className="check-row" key={name}><CheckCircle2 size={16} /><span>{name}</span><strong>{status}</strong></div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>ArgoCD Self-Healing Proof</h3>
        <p>Manual drift was created by scaling the frontend deployment to zero replicas. ArgoCD detected the live-state drift and restored the deployment automatically.</p>
        <pre>{`kubectl scale deployment mind-frontend -n mind --replicas=0
# After ArgoCD self-heal:
mind-frontend: 1/1 Running
mind-app: Synced / Healthy`}</pre>
      </div>
    </section>
  );
}

function Evidence() {
  return (
    <section className="section">
      <h2><Terminal size={24} /> Evidence & Screenshots Checklist</h2>
      <div className="card">
        <div className="evidence-grid">
          {screenshots.map((item) => (
            <div className="evidence-item" key={item}>
              <CheckCircle2 size={15} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="security-note">
          Optional next step: copy real screenshots into <code>public/screenshots/</code> and link them from this section.
        </p>
      </div>
    </section>
  );
}

function Qna() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return qna;
    return qna.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <section id="qna" className="section">
      <h2><CircleHelp size={24} /> Professor Q&A</h2>
      <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: ArgoCD, Trivy, SonarQube, Kubernetes..." /></div>
      <div className="qna-list">
        {filtered.map(([question, answer]) => (
          <div className="qna-card" key={question}><h3>{question}</h3><p>{answer}</p></div>
        ))}
      </div>
    </section>
  );
}

function ProductionNote() {
  return (
    <section className="section">
      <div className="production-note">
        <h2><Code2 size={24} /> Production Readiness Note</h2>
        <p>
          This is a lab/demo environment. For production, HTTPS, private networking, managed secrets,
          managed database or validated backups, central monitoring, logging, and enforced security gates are required.
        </p>
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <Overview />
      <Ec2ArchitectureDiagram />
      <ArchitectureSummary />
      <Pipeline />
      <Security />
      <Kubernetes />
      <Evidence />
      <Qna />
      <ProductionNote />
      <footer>DEPI DevSecOps Project Showcase â€” MIND Notes App</footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);


