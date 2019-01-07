pipeline {
  parameters {
      choice(name: 'CF_SPACE', choices: "\ntest\nacceptance\nproduction\ninternal", description: 'Which CF space to deploy to.')
      string(name: 'DOCKER_PORT', defaultValue: '49767', description: 'HTTP port on which Docker node image should listen.')
  }
  agent {
    dockerfile {
      additionalBuildArgs "--build-arg nuxt_env_build_public_path=${env.S3_ENDPOINT}/europeana-portaljs-${params.CF_SPACE}"
      args "-p ${params.DOCKER_PORT}:3000"
    }
  }
  environment {
    HOME='.'
  }
  stages {
    stage('Build') {
      steps {
        // The actual build is handled by the Dockerfile
        sh 'ls -l ./.nuxt/dist/*'
      }
    }
    stage('Push built assets to S3') {
      environment {
        S3_ENDPOINT="${env.S3_ENDPOINT}"
        S3_ACCESS=credentials("portaljs.${params.CF_SPACE}.s3")
        S3_BUCKET="europeana-portaljs-${params.CF_SPACE}"
        S3_REGION='eu-geo'
      }
      steps {
        sh 'AWS_ACCESS_KEY_ID="${S3_ACCESS_USR}" AWS_SECRET_ACCESS_KEY="${S3_ACCESS_PSW}" aws --region ${S3_REGION} --endpoint-url ${S3_ENDPOINT} s3 sync .nuxt/dist/client s3://${S3_BUCKET} --acl public-read --delete'
      }
    }
    stage('Deploy to CF') {
      environment {
        CF_API="${env.CF_API}"
        CF_LOGIN=credentials('portaljs.cloudfoundry.login')
        CF_ORG="${env.CF_ORG}"
        CF_SPACE="${params.CF_SPACE}"
        CF_APP_NAME="portaljs-${params.CF_SPACE}"
      }
      steps {
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
        sh 'cf plugins'
        sh 'echo "services:" >> manifest.yml'
        sh 'echo "  - elastic-apm" >> manifest.yml'
        sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
      }
    }
  }
}
