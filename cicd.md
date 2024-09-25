```groovy
pipeline {
    agent any
    
    tools {
        jdk 'jdk'
    }
    
    environment {
        SCANNER_HOME= tool 'sonar-scanner'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ayush148/project.git'
            }
        }
        
        stage('SonarQube Analsyis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -D"sonar.projectKey=ayush-123" -D"sonar.sources=." -Dsonar.projectName=review'''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {  // Adjust the timeout as needed
                    script {
                        waitForQualityGate abortPipeline: false, credentialsId: 'sonarqube-token'
                    }
                }
           }
        }
        
        
        stage('Zip Code') {
            steps {
                script {
                    // Create a zip file of the project directory
                    sh 'zip -r project.zip .'
                    
                }
            }
        }
    
        
        stage('Upload to Nexus repo') {
            steps {
                script {
                    nexusArtifactUploader credentialsId: 'nexus-id-pass', nexusUrl: 'localhost:8081', nexusVersion: 'nexus3', protocol: 'http', repository: 'project', version: "${env.BUILD_ID}-${env.BUILD_TIMESTAMP}"   ,artifacts: [
                            [artifactId: 'project', classifier: '', file: 'project.zip', type: 'zip']
                        ]
                    
                }
            }
        }



        stage('Build & Tag Docker Image') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker build -t rtxayush/project:web web"
                            sh "docker build -t rtxayush/project:db db"
                    }
               }
            }
        }
        
        stage('Push Docker Image') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker push rtxayush/project:web"
                            sh "docker push rtxayush/project:db"
                    }
               }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution finished.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}

```
