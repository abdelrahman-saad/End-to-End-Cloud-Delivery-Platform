# Security Scanning

## Trivy Integration

Trivy was integrated into the Jenkins pipeline to scan Docker images before pushing them to DockerHub.

## Scan Mode

Trivy currently runs in report-only mode using `|| true` so that the pipeline can complete while still showing security findings.

## Build #3 Results

| Image | HIGH/CRITICAL Findings |
|---|---:|
| Backend | 15 |
| Frontend | 1 |

## Value

This proves the pipeline includes DevSecOps visibility and can later be changed into a strict security gate.
