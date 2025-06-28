pipeline {
    agent any
    
    environment {
        APP_NAME = 'arctic-elec'
        DOCKER_IMAGE = "${APP_NAME}"
        DOCKER_TAG = "${BUILD_NUMBER}"
        PORT = '3333'
    }
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code source...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances...'
                sh 'yarn install'
            }
        }
        
        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        echo 'Vérification du code...'
                        sh 'npm run lint || true'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Construction de l\'image Docker...'
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Déploiement de l\'application...'
                script {
                    // Arrêter et supprimer l'ancien conteneur
                    sh """
                        docker stop ${APP_NAME} || true
                        docker rm ${APP_NAME} || true
                    """
                    
                    // Lancer le nouveau conteneur
                    sh """
                        docker run -d \
                            --name ${APP_NAME} \
                            --restart unless-stopped \
                            -p ${PORT}: \
                            ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                    
                    // Vérifier que l'application est accessible
                    sh """
                        sleep 10
                        curl -f http://localhost:${PORT} || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Nettoyage...'
            // Nettoyer les images Docker non utilisées
            sh 'docker image prune -f'
        }
        success {
            echo 'Pipeline exécuté avec succès ! 🎉'
            echo "Application accessible sur : http://localhost:${PORT}"
        }
        failure {
            echo 'Pipeline échoué ! ❌'
        }
    }
}