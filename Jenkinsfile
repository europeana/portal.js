pipeline {
  options {
    disableConcurrentBuilds()
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
    CF_SPACE="${env.BRANCH_NAME == 'master' ? 'test' : 'production'}"
    S3_PATH="${env.BRANCH_NAME == 'master' ? '/' : '/' + env.BRANCH_NAME}"
  }
  stages {
    stage('Build') {
      steps {
        configFileProvider([configFile(fileId: "portaljs.${env.CF_SPACE}.env", targetLocation: '.env')]) {
          sh 'eval "export $(grep ^NUXT_BUILD_PUBLIC_PATH= .env)${S3_PATH}"'
          sh 'rm -rf node_modules'
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Sync assets to S3') {
      environment {
        S3_ENDPOINT="${env.S3_ENDPOINT}"
        S3_ACCESS=credentials("portaljs.${env.CF_SPACE}.s3")
        S3_BUCKET="europeana-portaljs-${env.CF_SPACE}"
        S3_REGION='eu-geo'
      }
      steps {
        sh 'AWS_ACCESS_KEY_ID="${S3_ACCESS_USR}" AWS_SECRET_ACCESS_KEY="${S3_ACCESS_PSW}" aws --region ${S3_REGION} --endpoint-url ${S3_ENDPOINT} s3 sync .nuxt/dist/client s3://${S3_BUCKET}${S3_PATH} --acl public-read --delete'
      }
    }
    stage('Login to CF') {
      steps {
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
      }
    }
    stage('Deploy to CF') {
      environment {
        CF_APP_NAME="portaljs${env.CF_SPACE == 'production' ? '' : '-' + env.CF_SPACE}"
        CTF_CPA_ACCESS_TOKEN=credentials("portaljs.${env.CF_SPACE}.contentful.cpa")
        HTTP_DIGEST_ACL=credentials("portaljs.${env.CF_SPACE}.http.digest.acl")
      }
      steps {
        sh 'echo "services:" >> manifest.yml'
        sh 'echo "  - elastic-apm" >> manifest.yml'
        sh 'sed -i "s|env:|env:\\n  CTF_CPA_ACCESS_TOKEN: ${CTF_CPA_ACCESS_TOKEN}|" manifest.yml'
        sh 'sed -i "s|env:|env:\\n  HTTP_DIGEST_ACL: ${HTTP_DIGEST_ACL}|" manifest.yml'
        sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
      }
    }
    stage('Deploy Storybook') {
      when {
        environment name: 'CF_SPACE', value: 'test'
      }
      steps {
        sh 'npm run build-storybook'
        sh 'echo "---\\nbuildpack: staticfile_buildpack\\nmemory: 64M\\nstack: cflinuxfs3" > storybook-static/manifest.yml'
        sh 'cd storybook-static && cf blue-green-deploy portaljs-storybook -f manifest.yml --delete-old-apps'
      }
    }
  }
}
