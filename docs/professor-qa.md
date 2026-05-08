# Professor Q&A

<div class="depi-hero">
  <div class="depi-eyebrow">Presentation Ready</div>
  <h1>Quick answers for project discussion</h1>
  <p>
    Use this page to answer common questions about architecture, tools, security, Kubernetes, and GitOps.
  </p>
</div>

## Common Questions

??? question "What is the main goal of the project?"
    To demonstrate a complete DevSecOps workflow from GitHub source code to a running Kubernetes application, including CI, security scanning, image publishing, GitOps deployment, and self-healing validation.

??? question "Why did you use two EC2 servers?"
    The Jenkins EC2 handles CI/CD, scanning, and image building. The K3s EC2 handles the runtime Kubernetes environment. This separation makes the architecture cleaner and closer to real-world separation of build and runtime workloads.

??? question "Why Jenkins?"
    Jenkins provides visible pipeline stages and integrates easily with Docker-based tools like Gitleaks, SonarQube scanner, and Trivy.

??? question "Why Gitleaks?"
    Gitleaks prevents accidental secret exposure by scanning the repository before the application is built.

??? question "Why SonarQube?"
    SonarQube adds static code quality analysis and quality gate visibility.

??? question "Why Trivy?"
    Trivy scans Docker images for vulnerabilities before publishing/deployment.

??? question "Why DockerHub?"
    DockerHub is the image registry used to store backend and frontend images so Kubernetes can pull them.

??? question "Why K3s?"
    K3s is lightweight, affordable for EC2 lab usage, and still demonstrates real Kubernetes concepts.

??? question "What does ArgoCD prove?"
    ArgoCD proves GitOps delivery. It continuously syncs the cluster with the desired state in Git and can automatically repair drift.

??? question "How did you test self-healing?"
    The frontend deployment was manually scaled to zero replicas. ArgoCD detected the difference between live cluster state and Git desired state, then restored it.

??? question "What would you change for production?"
    Add HTTPS, private networking, managed secrets, centralized monitoring/logging, database backups, stricter security gates, resource limits, and an ingress controller.
