pipeline {
    agent any

    stages {
        stage('Stop Running Application') {
            steps {
                script {
                    // Stop any running processes that might be using the /opt/crrc-web directory
                    sh 'pkill -f "npm run start" || true'
                }
            }
        }
        stage('Move Repository to /opt/patho-web') {
            steps {
                    sh 'rsync -av --exclude=".git" . /opt/patho-web'
            }
        }
        stage('Start Application') {
            steps {
                withEnv(['PATH+NODEJS=/usr/bin/node']) {
                        sh 'node --version'
                        sh 'sh /opt/patho-web/deploy.sh'
                        sh 'cat /opt/patho-web/deploy.log'
                }
            }
        }
    }
}
