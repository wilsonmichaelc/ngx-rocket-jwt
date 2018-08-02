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
		stage('Build') {
			steps {
				echo 'Build here (maybe with webpack or something similar'
				sh 'npm run build'
			}
		}
		stage('deploy-production'){
		  when{
		    branch 'master'
		  }
		  steps {
		    echo 'Deploy Production'
		    sh 'npm run build'
		    sh 'aws s3 cp dist $DEVELOPMENT_S3_BUCKET --recursive --acl public-read'
		    sh 'aws cloudfront create-invalidation --distribution-id $DEVELOPMENT_CLOUDFRONT_ID --paths /index.html'
		  }
		}
		stage('deploy-development'){
		  when{
		    branch 'development'
		  }
		  steps {
		    echo 'Deploy Development'
		    sh 'npm run build'
		    sh 'aws s3 cp dist $PRODUCTION_S3_BUCKET --recursive --acl public-read'
		    sh 'aws cloudfront create-invalidation --distribution-id $PRODUCTION_CLOUDFRONT_ID --paths /index.html'
		  }
		}
	}
}

