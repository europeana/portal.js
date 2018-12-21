pipeline {
    agent any
    parameters {
        choice(name: 'DEPLOY_TO', choices: "\ntest\nacceptance\nproduction\ninternal", description: 'Which CF space to deploy to.')
        string(name: 'DOCKER_PORT', defaultValue: '49767', description: 'HTTP port on which Docker node image should listen.')
    }
    stages {
        stage('Build') {
            agent {
                dockerfile {
                    args "-p ${params.DOCKER_PORT}:3000"
                }
            }
            environment {
                HOME = '.'
            }
            steps {
                checkout scm
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Deploy to CF test space') {
            when {
                anyOf {
                    branch 'develop'
                    environment name: 'DEPLOY_TO', value: 'test'
                }
            }
            environment {
                CF_HOME="${env.HOME}/.cf/${env.JOB_NAME}"
                CF_API="${env.CF_API}"
                CF_LOGIN=credentials('portaljs.cloudfoundry.login')
                CF_ORG="${env.CF_ORG}"
                CF_SPACE="test"
                CF_APP_NAME="portaljs-test"
            }
            steps {
                sh 'mkdir -p ${CF_HOME}'
                sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p ${CF_LOGIN_PSW} -o ${CF_ORG} -s ${CF_SPACE}'
                sh 'echo "services:" >> manifest.yml'
                sh 'echo "  - elastic-apm" >> manifest.yml'
                sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
            }
        }
    }
}
