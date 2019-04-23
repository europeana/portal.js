pipeline {
  options {
    disableConcurrentBuilds()
  }
  parameters {
    choice(name: 'CF_SPACE', choices: "test\nacceptance\nproduction\ninternal", description: 'Which CF space to deploy to.')
  }
  agent {
    dockerfile {
      args "-u node:node"
    }
  }
  environment {
    CF_HOME='/home/node' // Revert override from Jenkins global env
    CF_API="${env.CF_API}"
    CF_LOGIN=credentials('portaljs.cloudfoundry.login')
    CF_ORG="${env.CF_ORG}"
    CF_SPACE="${params.CF_SPACE}"
  }
  stages {
    stage('Build') {
      environment {
        CTF_CDA_ACCESS_TOKEN=credentials("portaljs.${params.CF_SPACE}.contentful.cda_access_token")
        CTF_SPACE_ID=credentials("portaljs.${params.CF_SPACE}.contentful.space_id")
        EUROPEANA_API_KEY=credentials("portaljs.${params.CF_SPACE}.europeana.api_key")
        EUROPEANA_ENTITY_API_KEY=credentials("portaljs.${params.CF_SPACE}.europeana.entity_api_key")
        NUXT_ENV_BUILD_PUBLIC_PATH="${env.S3_ENDPOINT}/europeana-portaljs-${params.CF_SPACE}"
      }
      steps {
        sh 'echo "CTF_CDA_ACCESS_TOKEN=${CTF_CDA_ACCESS_TOKEN}" >> .env'
        sh 'echo "CTF_SPACE_ID=${CTF_SPACE_ID}" >> .env'
        sh 'echo "EUROPEANA_API_KEY=${EUROPEANA_API_KEY}" >> .env'
        sh 'echo "EUROPEANA_ENTITY_API_KEY=${EUROPEANA_ENTITY_API_KEY}" >> .env'
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Sync assets to S3') {
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
    stage('Login to CF') {
      steps {
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
      }
    }
    stage('Deploy Storybook') {
      when {
        environment name: 'CF_SPACE', value: 'test'
      }
      steps {
        sh 'npm run build-storybook'
        sh 'echo "---\\nbuildpack: staticfile_buildpack\\nmemory: 64M" > storybook-static/manifest.yml'
        sh 'cd storybook-static && cf blue-green-deploy portaljs-storybook -f manifest.yml --delete-old-apps'
      }
    }
    stage('Deploy to CF') {
      environment {
        CF_APP_NAME="portaljs-${params.CF_SPACE}"
      }
      steps {
        sh 'echo "services:" >> manifest.yml'
        sh 'echo "  - elastic-apm" >> manifest.yml'
        sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
      }
    }
  }
}
