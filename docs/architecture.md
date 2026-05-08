# Architecture

<div class="depi-hero">
  <div class="depi-eyebrow">Infrastructure Design</div>
  <h1>Two-EC2 DevSecOps architecture</h1>
  <p>
    The project uses one EC2 server for CI/CD and scanning, and a second EC2 server
    for the production-like Kubernetes runtime.
  </p>
</div>

## High-Level Design

```mermaid
flowchart LR
    Dev[Developer] -->|Push code| GH[GitHub Repository]

    subgraph EC2A["EC2 #1: depi-jenkins-server"]
        JK[Jenkins CI - Port 8080]
        GL[Gitleaks Secret Scan]
        SQ[SonarQube - Port 9000]
        DK[Docker Engine]
        TV[Trivy Image Scan]
        DOCS[MkDocs Source]
    end

    subgraph External["External Services"]
        DH[DockerHub Registry]
        GP[GitHub Pages]
        DD[DuckDNS]
    end

    subgraph EC2B["EC2 #2: depi-k3s-server"]
        K3S[K3s Kubernetes Cluster]
        ARGO[ArgoCD - Port 32000]
        FE[MIND Frontend - NodePort 30080]
        BE[MIND Backend API]
        DB[(PostgreSQL + PVC)]
    end

    GH --> JK
    JK --> GL
    JK --> SQ
    JK --> DK
    DK --> TV
    TV --> DH
    GH --> ARGO
    ARGO --> K3S
    K3S --> DH
    K3S --> FE
    K3S --> BE
    K3S --> DB
    FE --> BE
    BE --> DB
    DD --> FE
    DOCS --> GP
```

## EC2 #1 — Jenkins Server

<div class="depi-grid">
  <div class="depi-card"><h3>Jenkins</h3><p>Runs the CI pipeline and coordinates the DevSecOps workflow.</p></div>
  <div class="depi-card"><h3>Docker Engine</h3><p>Builds backend and frontend images.</p></div>
  <div class="depi-card"><h3>Gitleaks</h3><p>Checks the repository for leaked credentials.</p></div>
  <div class="depi-card"><h3>SonarQube</h3><p>Provides static code analysis and quality gate visibility.</p></div>
  <div class="depi-card"><h3>Trivy</h3><p>Scans Docker images for vulnerabilities.</p></div>
  <div class="depi-card"><h3>DuckDNS updater</h3><p>Keeps Jenkins demo URL stable after EC2 public IP changes.</p></div>
</div>

## EC2 #2 — K3s Server

<div class="depi-grid">
  <div class="depi-card"><h3>K3s</h3><p>Lightweight Kubernetes cluster for the application runtime.</p></div>
  <div class="depi-card"><h3>ArgoCD</h3><p>GitOps deployment, sync, prune, and self-healing.</p></div>
  <div class="depi-card"><h3>Frontend</h3><p>React app served through Nginx and exposed through NodePort.</p></div>
  <div class="depi-card"><h3>Backend</h3><p>Go API with health endpoint.</p></div>
  <div class="depi-card"><h3>PostgreSQL</h3><p>Database pod with persistent volume claim.</p></div>
  <div class="depi-card"><h3>DuckDNS updater</h3><p>Keeps app and ArgoCD demo URLs stable.</p></div>
</div>

## Why this design is good for the demo

| Design Choice | Reason |
|---|---|
| Separate Jenkins and K3s EC2 servers | Keeps CI/CD workload separate from runtime workload |
| DockerHub registry | Allows Kubernetes to pull built images independently |
| ArgoCD GitOps | Makes Git the source of truth |
| DuckDNS | Avoids broken documentation links after EC2 IP changes |
| K3s | Lightweight, cost-effective Kubernetes for lab/demo |
| PostgreSQL PVC | Demonstrates persistence in Kubernetes |

## Data Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant JK as Jenkins
    participant SEC as Gitleaks/SonarQube/Trivy
    participant DH as DockerHub
    participant AR as ArgoCD
    participant K3S as K3s
    participant APP as MIND App

    Dev->>GH: Push code
    GH->>JK: Jenkins checks out source
    JK->>SEC: Run security and quality scans
    JK->>DH: Push backend and frontend images
    GH->>AR: Kubernetes manifests are watched
    AR->>K3S: Sync desired state
    K3S->>DH: Pull images
    K3S->>APP: Run frontend, backend, and DB
```
