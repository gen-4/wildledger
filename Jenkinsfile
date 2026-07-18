node {
	def app

	System.setProperty("org.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL", "86400")

	stage('Clone repository') {
		echo 'Cloning repository...'
		checkout scm
		echo 'Repository cloned'
	}

	stage('Build api image') {
		echo 'Building api image...'
		dir('backend') {
			retry(3) {
				app = docker.build("wildledger_api_image:latest")
			}
		}
		echo 'Image built'
	}


	stage('Build web image') {
		echo 'Building web image...'

		dir('frontend') {
			retry(3) {
				app = docker.build("wildledger_web_image:latest", 
				"--build-arg BASE_URL=/wildledger/ " +
				"--build-arg VITE_API_URL=https://cronushub.ddns.net/wildledger-api/api/0.1.0 .")
			}
		}
		echo 'Image built'
	}

	stage('Deploying WildLedger') {
		sh '/home/hera/scripts/restart_composition.sh'
	}
}
