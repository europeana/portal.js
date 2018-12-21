pipeline {
    agent any
    parameters {
        choice(name: 'CF_SPACE', choices: "test\nacceptance\nproduction", description: 'CF space to deploy to.')
        string(name: 'DOCKER_PORT', defaultValue: '49767', description: 'HTTP port on which Docker node image should listen.')
        string(name: 'GIT_BRANCH_OR_TAG', defaultValue: 'develop', description: 'Git branch or tag to build.')
    }
    stages {
        stage('Build') {
            agent {
                dockerfile {
                    label 'portaljs'
                    args "-p ${params.DOCKER_PORT}:3000"
                }
            }
            environment {
                HOME = '.'
            }
            steps {
                git url: 'https://github.com/europeana/incubator-portal-vue-nuxt.git', branch: "${params.GIT_BRANCH_OR_TAG}"
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Deploy to CF') {
            environment {
                CF_HOME="${env.HOME}/.cf/${env.JOB_NAME}"
                CF_API="${env.CF_API}"
                CF_LOGIN=credentials('portaljs.cloudfoundry.login')
                CF_ORG="${env.CF_ORG}"
                CF_SPACE="${params.CF_SPACE}"
                CF_APP_NAME="portaljs-${params.CF_SPACE}"
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
