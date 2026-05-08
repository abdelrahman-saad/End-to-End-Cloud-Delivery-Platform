# Security Scanning

<div class="depi-hero">
  <div class="depi-eyebrow">DevSecOps Controls</div>
  <h1>Security and quality built into the pipeline</h1>
  <p>
    The project includes three layers of CI security visibility: secret detection, static code analysis,
    and container image vulnerability scanning.
  </p>
</div>

## Security Layers

<div class="depi-grid">
  <div class="depi-card">
    <h3>Gitleaks</h3>
    <p>Runs before Docker build to detect secrets inside the repository.</p>
  </div>
  <div class="depi-card">
    <h3>SonarQube</h3>
    <p>Analyzes source code quality, maintainability, and reliability.</p>
  </div>
  <div class="depi-card">
    <h3>Trivy</h3>
    <p>Scans Docker images for OS and dependency vulnerabilities.</p>
  </div>
</div>

## Security Flow

```mermaid
flowchart LR
  Repo[GitHub Repository] --> Gitleaks[Gitleaks Secret Scan]
  Gitleaks --> Sonar[SonarQube Code Scan]
  Sonar --> Build[Docker Build]
  Build --> Trivy[Trivy Image Scan]
  Trivy --> Push[Push to DockerHub]
```

## Current Demo Mode

| Tool | Mode | Result |
|---|---|---|
| Gitleaks | Report / non-blocking | No leaks found evidence |
| SonarQube | Report / quality gate visibility | Project analysis available |
| Trivy | Report-only | Vulnerability visibility without blocking demo |

!!! tip "Production improvement"
    In production, the pipeline should fail when Gitleaks finds secrets, when SonarQube quality gate fails, or when Trivy finds unacceptable HIGH/CRITICAL vulnerabilities.

## Why this matters

Security is not left until after deployment. It is part of the delivery flow, which makes the project a real DevSecOps demonstration rather than only a CI/CD deployment.
