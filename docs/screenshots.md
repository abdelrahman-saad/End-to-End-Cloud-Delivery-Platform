# Project Screenshots

This page contains visual proof of the complete DEPI DevSecOps workflow, from source code to CI/CD, security scanning, DockerHub publishing, Kubernetes deployment, ArgoCD GitOps, and self-healing validation.

---

## 1. GitHub Repository

The GitHub repository contains the application source code, Jenkins pipeline, Kubernetes manifests, MkDocs documentation, and GitHub Pages workflow.

![GitHub Repository](screenshots/github-repo.png)

---

## 2. MkDocs Documentation Website

The project documentation is published using MkDocs Material and GitHub Pages.

![MkDocs Home](screenshots/mkdocs-home.png)

---

## 3. Jenkins Dashboard

Jenkins is running on AWS EC2 and contains the CI pipeline job for the MIND application.

![Jenkins Dashboard](screenshots/jenkins-dashboard.png)

---

## 4. Jenkins Successful Build

The Jenkins pipeline completed successfully and pushed Docker images to DockerHub.

![Jenkins Build Success](screenshots/jenkins-build-success.png)

---

## 5. Jenkins Gitleaks Secret Scan

The Jenkins pipeline runs Gitleaks before building Docker images to check the repository for leaked secrets. Build #5 completed with no leaks found.

![Jenkins Gitleaks Console](screenshots/jenkins-gitleaks-console.png)

---

## 6. Jenkins Trivy Scan Output

Trivy security scanning is integrated into the Jenkins pipeline in report-only mode.

![Jenkins Trivy Console](screenshots/jenkins-trivy-console.png)

---

## 7. DockerHub Backend Image

The backend Docker image was built by Jenkins and pushed to DockerHub with versioned tags.

![DockerHub Backend](screenshots/dockerhub-backend.png)

---

## 8. DockerHub Frontend Image

The frontend Docker image was built by Jenkins and pushed to DockerHub with versioned tags.

![DockerHub Frontend](screenshots/dockerhub-frontend.png)

---

## 9. K3s Kubernetes Resources

The application is deployed on a single-node K3s Kubernetes cluster running on AWS EC2.

![K3s Pods and Services](screenshots/k3s-pods.png)

---

## 10. MIND App Running

The MIND Notes App is publicly accessible through the K3s NodePort service and DuckDNS.

![MIND App](screenshots/mind-app.png)

---

## 11. API Health Check

The backend API health endpoint confirms that the frontend proxy and backend service are working.

![API Health](screenshots/api-health.png)

---

## 12. ArgoCD Synced and Healthy

ArgoCD manages the Kubernetes deployment from the GitHub repository and keeps the application synced.

![ArgoCD Synced](screenshots/argocd-synced.png)

---

## 13. ArgoCD Self-Healing Test

A live drift test was performed by scaling the frontend deployment to zero replicas. ArgoCD detected the drift and restored the application back to the desired state from Git.

![ArgoCD Self Heal](screenshots/argocd-self-heal.png)
