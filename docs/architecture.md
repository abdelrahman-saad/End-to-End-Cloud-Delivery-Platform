# Architecture

## High-Level Architecture

```mermaid
flowchart LR
    A[Developer] --> B[GitHub Repository]
    B --> C[Jenkins CI]
    C --> D[Docker Build]
    D --> E[Trivy Scan]
    E --> F[DockerHub Registry]
    F --> G[ArgoCD]
    G --> H[K3s Kubernetes Cluster]
    H --> I[Frontend Service NodePort 30080]
    H --> J[Backend Service ClusterIP]
    J --> K[(PostgreSQL PVC)]
```

## AWS Servers

| Server | Purpose | Access |
|---|---|---|
| depi-jenkins-server | Jenkins CI | http://depi-jenkins-depi.duckdns.org:8080 |
| depi-k3s-server | K3s + ArgoCD + App | http://depi-k3s-depi.duckdns.org |

## Networking

| Port | Purpose |
|---:|---|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 6443 | Kubernetes API |
| 30080 | MIND App NodePort |
| 32000 | ArgoCD NodePort |
| 8080 | Jenkins |
