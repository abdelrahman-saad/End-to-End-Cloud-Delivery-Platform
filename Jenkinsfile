pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        DOCKERHUB_USER = 'fadyy2k'
        BACKEND_IMAGE = 'fadyy2k/mind-backend'
        FRONTEND_IMAGE = 'fadyy2k/mind-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show Workspace') {
            steps {
                sh '''
                    pwd
                    ls -la
                    ls -la MIND
                '''
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                    mkdir -p gitleaks-reports

                    echo "========== Gitleaks Secret Scan =========="

                    docker run --rm \
                      -v "$PWD:/repo" \
                      ghcr.io/gitleaks/gitleaks:latest detect \
                      --source /repo \
                      --no-git \
                      --redact \
                      --verbose \
                      --exit-code 0 | tee gitleaks-reports/gitleaks-console-report.txt || true

                    echo "========== Gitleaks Report =========="
                    cat gitleaks-reports/gitleaks-console-report.txt || true
                '''
            }
        }

        stage('SonarQube Code Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        echo "========== SonarQube Code Scan =========="

                        docker run --rm \
                          --network host \
                          -v "$PWD:/usr/src" \
                          sonarsource/sonar-scanner-cli:latest \
                          -Dsonar.projectKey=depi-mind-app-v2 \
                          -Dsonar.projectName="DEPI MIND App" \
                          -Dsonar.sources=MIND/backend,MIND/frontend \
                          -Dsonar.host.url=http://localhost:9000 \
                          -Dsonar.token=$SONAR_TOKEN \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/vendor/** || true
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest MIND/backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest MIND/frontend
                '''
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh '''
                    mkdir -p trivy-reports

                    echo "========== Backend Trivy Scan =========="
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --severity HIGH,CRITICAL \
                      --no-progress \
                      --format table \
                      ${BACKEND_IMAGE}:${IMAGE_TAG} | tee trivy-reports/backend-trivy-report.txt || true

                    echo "========== Frontend Trivy Scan =========="
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --severity HIGH,CRITICAL \
                      --no-progress \
                      --format table \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG} | tee trivy-reports/frontend-trivy-report.txt || true
                '''
            }
        }

        stage('DockerHub Login') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDS_PSW" | docker login -u "$DOCKERHUB_CREDS_USR" --password-stdin
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }

        success {
            echo 'Pipeline completed successfully. Images scanned by Trivy and pushed to DockerHub.'
        }

        failure {
            echo 'Pipeline failed. Check console output.'
        }
    }
}
