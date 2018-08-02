pipeline {
	agent any
	environment {
		TEST = "None"
	}
	stages {
		stage('Install Dependencies') {
			steps {
				echo 'Run NPM install here'
				sh 'npm install'
			}
		}
		stage('Test') {
			steps {
				echo 'npm run test here'
				sh 'npm run test:ci'
			}
		}
		stage('Build') {
			steps {
				echo 'Build here (maybe with webpack or something similar'
				sh ''
			}
		}
		stage('Deploy to Dev') {
			steps {
				echo 'Deploy here'
			}
		}
	}
}
