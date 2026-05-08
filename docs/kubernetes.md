# Kubernetes Deployment

## Cluster

- Kubernetes distribution: K3s
- Node role: control-plane
- Node status: Ready
- Container runtime: containerd

## Namespace

`mind`

## Resources

| Type | Name |
|---|---|
| Secret | postgres-secret |
| PVC | postgres-pvc |
| Deployment | postgres |
| Deployment | mind-backend |
| Deployment | mind-frontend |
| Service | postgres |
| Service | backend-service |
| Service | mind-frontend-service |

## Exposure

| Service | Type | Port |
|---|---|---:|
| mind-frontend-service | NodePort | 30080 |

## Validation Commands

```bash
kubectl get nodes -o wide
kubectl get pods -n mind -o wide
kubectl get svc -n mind
curl -i http://localhost:30080/api/health
```
