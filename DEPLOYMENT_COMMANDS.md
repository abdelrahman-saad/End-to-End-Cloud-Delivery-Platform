# Deployment Commands Reference

## Local Build and Push Workflow

### 1. Clone the repository

```bash
git clone https://github.com/fadyy2k/depi-mind-app-v2.git
cd depi-mind-app-v2
```

### 2. Make changes

Edit documentation, manifests, or showcase as needed.

### 3. Check status

```bash
git status
git diff
```

### 4. Stage changes

```bash
# Stage all changes
git add .

# Or stage specific files
git add docs/index.md docs/architecture.md
git add showcase/src/App.jsx
git add README.md
```

### 5. Commit

```bash
git commit -m "Update documentation and showcase"
```

### 6. Push to GitHub

```bash
git push origin main
```

### 7. Check GitHub Actions

Navigate to: https://github.com/fadyy2k/depi-mind-app-v2/actions

Wait for the workflow "Deploy MkDocs and Showcase to GitHub Pages" to complete.
The workflow typically takes 2-3 minutes.

### 8. Verify final URLs

```bash
# MkDocs documentation
open https://fadyy2k.github.io/depi-mind-app-v2/

# Visual showcase
open https://fadyy2k.github.io/depi-mind-app-v2/showcase/
```

---

## Local MkDocs Development

```bash
# Install dependencies
pip install mkdocs-material

# Serve with hot reload
mkdocs serve

# Build static site
mkdocs build
# Output: site/
```

---

## Local Showcase Development

```bash
cd showcase

# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Production build
npm run build
# Output: showcase/dist/

# Preview production build
npm run preview
```

**Important:** The Vite base path in `vite.config.js` must be:
```javascript
base: '/depi-mind-app-v2/showcase/'
```

This is required for GitHub Pages subdirectory routing. Do not change this for local dev — use `npm run preview` to test the production build locally.

---

## Manual Local Docker Build

```bash
# Build backend
docker build -t fadyy2k/mind-backend ./MIND/backend

# Build frontend
docker build -t fadyy2k/mind-frontend ./MIND/frontend

# Run locally with Compose
docker compose up

# Run dev mode
docker compose -f docker-compose.dev.yml up
```

---

## Kubernetes Operations

```bash
# Check all resources
kubectl get all -n mind

# Check pods
kubectl get pods -n mind -o wide

# Check services
kubectl get svc -n mind

# Check PVC
kubectl get pvc -n mind

# Check ArgoCD application
kubectl get application mind-app -n argocd

# ArgoCD app details
argocd app get mind-app

# Force ArgoCD sync
argocd app sync mind-app

# Self-healing test (ArgoCD will restore within ~90 seconds)
kubectl scale deployment mind-frontend -n mind --replicas=0

# Watch pod recovery
kubectl get pods -n mind -w

# Restart a deployment
kubectl rollout restart deployment/mind-backend -n mind

# Check pod logs
kubectl logs -n mind deployment/mind-backend --tail=50
kubectl logs -n mind deployment/mind-frontend --tail=50
kubectl logs -n mind deployment/postgres --tail=50
```

---

## Jenkins Pipeline

```bash
# Trigger via Jenkins UI
# Navigate to: http://depi-jenkins-depi.duckdns.org:8080
# Click pipeline job → Build Now

# Or trigger via Jenkins CLI (if configured)
java -jar jenkins-cli.jar -s http://depi-jenkins-depi.duckdns.org:8080 build depi-mind-app-v2
```

---

## API Health Check

```bash
# Check API health
curl http://depi-k3s-depi.duckdns.org:30080/api/health

# Expected response:
# {"message":"Notes API is running","status":"ok"}
```

---

## GitHub Pages Configuration

In GitHub repository settings:
- Settings → Pages → Source → **GitHub Actions**

The workflow file: `.github/workflows/deploy-pages-combined.yml`

---

## DuckDNS Update (after EC2 IP change)

If EC2 instance is stopped/started and the IP changes:

```bash
# Update DuckDNS for EC2 #1
curl "https://www.duckdns.org/update?domains=depi-jenkins-depi&token=YOUR_TOKEN&ip=NEW_EC2_1_IP"

# Update DuckDNS for EC2 #2
curl "https://www.duckdns.org/update?domains=depi-k3s-depi&token=YOUR_TOKEN&ip=NEW_EC2_2_IP"
```

Replace `YOUR_TOKEN` with your DuckDNS token and `NEW_EC2_X_IP` with the new public IP from the AWS console.
