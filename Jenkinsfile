pipeline {
  parameters {
    choice(name: 'CF_SPACE', choices: "test\nacceptance\nproduction\ninternal", description: 'Which CF space to deploy to.')
  }
  agent {
    dockerfile {
      args "-u node:node"
    }
  }
  stages {
    stage('Build') {
      environment {
        NUXT_ENV_BUILD_PUBLIC_PATH="${env.S3_ENDPOINT}/europeana-portaljs-${params.CF_SPACE}"
      }
      steps {
        sh 'npm install --only=production'
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
    stage('Deploy to CF') {
      environment {
        CF_API="${env.CF_API}"
        CF_LOGIN=credentials('portaljs.cloudfoundry.login')
        CF_ORG="${env.CF_ORG}"
        CF_SPACE="${params.CF_SPACE}"
        CF_APP_NAME="portaljs-${params.CF_SPACE}"
        CF_HOME='/home/node' // Revert override from Jenkins global env
        CTF_CDA_ACCESS_TOKEN=credentials("portaljs.${params.CF_SPACE}.contentful.cda_access_token")
        CTF_SPACE_ID=credentials("portaljs.${params.CF_SPACE}.contentful.space_id")
      }
      steps {
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
        sh 'echo "services:" >> manifest.yml'
        sh 'echo "  - elastic-apm" >> manifest.yml'
        sh 'sed -i "s|env:|env:\\n  CTF_SPACE_ID: ${CTF_SPACE_ID}|" manifest.yml'
        sh 'sed -i "s|env:|env:\\n  CTF_CDA_ACCESS_TOKEN: ${CTF_CDA_ACCESS_TOKEN}|" manifest.yml'
        sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
      }
    }
  }
}
