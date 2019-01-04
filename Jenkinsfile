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
      }
    }
    stage('Push assets to S3 test bucket') {
      when {
        anyOf {
          branch 'develop'
          environment name: 'DEPLOY_TO', value: 'test'
        }
      }
      environment {
        S3_ENDPOINT="${env.S3_ENDPOINT}"
        S3_ACCESS=credentials('portaljs.test.s3')
        S3_BUCKET='europeana-portaljs-test'
        S3_REGION='eu-geo'
      }
      steps {
        sh 'AWS_ACCESS_KEY_ID="${S3_ACCESS_USR}" AWS_SECRET_ACCESS_KEY="${S3_ACCESS_PSW}" aws --region ${S3_REGION} --endpoint-url ${S3_ENDPOINT} s3 sync .nuxt/dist/client s3://${S3_BUCKET} --acl public-read --delete'
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
        S3_ENDPOINT="${env.S3_ENDPOINT}"
        S3_BUCKET='europeana-portaljs-test'
      }
      steps {
        sh 'mkdir -p ${CF_HOME}'
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
        sh 'echo "services:" >> manifest.yml'
        sh 'echo "  - elastic-apm" >> manifest.yml'
        sh 'sed -i "s|env:|env:\\n  NUXT_BUILD_PUBLIC_PATH: ${S3_ENDPOINT}/${S3_BUCKET}|" manifest.yml'
        sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
      }
    }
  }
}
