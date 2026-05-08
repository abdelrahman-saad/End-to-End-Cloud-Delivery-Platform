# DEPI DevSecOps Project — MIND Notes App

![Project Banner](assets/depi-banner.svg)


## Project Demo Links

| Service | URL |
|---|---|
| GitHub Repository | https://github.com/fadyy2k/depi-mind-app-v2 |
| Live Documentation | https://fadyy2k.github.io/depi-mind-app-v2/ |
| Jenkins | http://depi-jenkins-depi.duckdns.org:8080 |
| MIND App | http://depi-k3s-depi.duckdns.org:30080 |
| API Health | http://depi-k3s-depi.duckdns.org:30080/api/health |
| ArgoCD | http://depi-k3s-depi.duckdns.org:32000 |
| DockerHub Backend | https://hub.docker.com/r/fadyy2k/mind-backend |
| DockerHub Frontend | https://hub.docker.com/r/fadyy2k/mind-frontend |

---
## Overview

This documentation explains the complete DEPI DevSecOps project built on AWS using Jenkins, Docker, Trivy, DockerHub, K3s Kubernetes, and ArgoCD GitOps.

## Live Services

| Service | URL |
|---|---|
| Jenkins | http://depi-jenkins-depi.duckdns.org:8080 |
| MIND App | http://depi-k3s-depi.duckdns.org:30080 |
| API Health | http://depi-k3s-depi.duckdns.org:30080/api/health |
| ArgoCD | http://depi-k3s-depi.duckdns.org:32000 |

## Application Stack

| Layer | Technology |
|---|---|
| Frontend | React + Nginx |
| Backend | Go API |
| Database | PostgreSQL |
| CI | Jenkins |
| Registry | DockerHub |
| Security | Trivy |
| Kubernetes | K3s |
| GitOps | ArgoCD |
| DNS | DuckDNS |

## Final Result

- K3s node is Ready
- Backend pod is Running
- Frontend pod is Running
- PostgreSQL pod is Running
- ArgoCD app is Synced and Healthy
- API health returns 200 OK
