# Operations

## DuckDNS

DuckDNS is used to avoid hardcoding changing AWS public IPs.

| Service | DuckDNS URL |
|---|---|
| Jenkins | depi-jenkins-depi.duckdns.org |
| K3s/App/ArgoCD | depi-k3s-depi.duckdns.org |

Both EC2 servers run a cron job every 5 minutes to update DuckDNS.

## Final Validation

```bash
kubectl get nodes -o wide
kubectl get pods -n mind -o wide
kubectl get svc -n mind
kubectl get application mind-app -n argocd
curl -i http://localhost:30080/api/health
```

Expected result:

- Node Ready
- All MIND pods Running
- ArgoCD Synced / Healthy
- API health 200 OK
