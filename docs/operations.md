# Operations

<div class="depi-hero">
  <div class="depi-eyebrow">Runbook</div>
  <h1>Operational commands and demo checks</h1>
  <p>
    These commands are useful for validating the project during review or demo.
  </p>
</div>

## Kubernetes Validation

```bash
kubectl get nodes -o wide
kubectl get pods -n mind -o wide
kubectl get svc -n mind
kubectl get application mind-app -n argocd
curl -i http://localhost:30080/api/health
```

## Jenkins Server Checks

```bash
docker ps
curl -I http://localhost:8080
curl -I http://localhost:9000
```

## DuckDNS Checks

```bash
dig +short depi-jenkins-depi.duckdns.org
dig +short depi-k3s-depi.duckdns.org
```

## Demo Login

| Service | Access |
|---|---|
| Jenkins | No login required |
| MIND App | `demo@example.com` / `demo123456` |
| ArgoCD | Demo credentials only |
| SonarQube | Demo credentials only |

!!! warning "Do not publish secrets"
    Keep ArgoCD, SonarQube, DockerHub, GitHub, SSH, and AWS credentials private.
