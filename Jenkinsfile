defaultChoices = ["test", "acceptance", "production", "internal"]

List createChoices(List defaultChoices) {
  GIT_TAG_COMMIT = sh(script: 'git describe --tags --always', returnStdout: true).trim()
  if (GIT_TAG_COMMIT =~ "^v\d+\.\d+\.\d+$") {
     return defaultChoices
  }
  choices = defaultChoices.minus('production')
  choices.add(0, 'production')
  return choices
}

choices = createChoices(defaultChoices)

properties ([
  disableConcurrentBuilds(),
  parameters ([
    choice (
      name: 'CF_SPACE',
      choices: choices.join("\n"),
      description: 'Which CF space to deploy to.')
  ])
])

node {
  withEnv(["CF_HOME=/home/node", // Revert override from Jenkins global env
           "CF_API=${env.CF_API}",
           "CF_LOGIN=${credentials('portaljs.cloudfoundry.login')}",
           "CF_ORG=${env.CF_ORG}",
           "CF_SPACE=${params.CF_SPACE}",
           "GIT_TAG_COMMIT=${sh (script: 'git describe --tags --always', returnStdout: true).trim()}"]) {
    docker.build("agent-image").inside('-u node:node') {
      stage('Build') {
        withEnv(["NUXT_ENV_BUILD_PUBLIC_PATH=${env.S3_ENDPOINT}/europeana-portaljs-${params.CF_SPACE}"]) {
          configFileProvider([configFile(fileId: "portaljs.${params.CF_SPACE}.env", targetLocation: '.env')]) {
            sh 'npm install'
            sh 'npm run build'
          }
        }
      }
      stage('Sync assets to S3') {
        withEnv(["S3_ENDPOINT=${env.S3_ENDPOINT}",
                 "S3_ACCESS=${credentials("portaljs.${params.CF_SPACE}.s3")}",
                 "S3_BUCKET=europeana-portaljs-${params.CF_SPACE}",
                 "S3_REGION=eu-geo"]) {
          sh 'AWS_ACCESS_KEY_ID="${S3_ACCESS_USR}" AWS_SECRET_ACCESS_KEY="${S3_ACCESS_PSW}" aws --region ${S3_REGION} --endpoint-url ${S3_ENDPOINT} s3 sync .nuxt/dist/client s3://${S3_BUCKET} --acl public-read --delete'
        }
      }
      stage('Login to CF') {
        sh 'cf login -a ${CF_API} -u ${CF_LOGIN_USR} -p "${CF_LOGIN_PSW}" -o ${CF_ORG} -s ${CF_SPACE}'
      }
      stage('Deploy Storybook') {
        if (params.CF_SPACE == 'test') {
          sh 'npm run build-storybook'
          sh 'echo "---\\nbuildpack: staticfile_buildpack\\nmemory: 64M\\nstack: cflinuxfs3" > storybook-static/manifest.yml'
          sh 'cd storybook-static && cf blue-green-deploy portaljs-storybook -f manifest.yml --delete-old-apps'
        }
      }
      stage('Deploy to CF') {
        if (env.BRANCH_NAME == 'master' && params.CF_SPACE != 'production' ) {
          withEnv(["CF_APP_NAME=portaljs-${params.CF_SPACE}"]) {
            sh 'echo "services:" >> manifest.yml'
            sh 'echo "  - elastic-apm" >> manifest.yml'
            sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
          }
        } else if (GIT_TAG_COMMIT =~ "^v\d+\.\d+\.\d+$") {
          withEnv(["CF_APP_NAME=portaljs"]) {
            sh 'echo "services:" >> manifest.yml'
            sh 'echo "  - elastic-apm" >> manifest.yml'
            sh 'cf blue-green-deploy ${CF_APP_NAME} -f manifest.yml --delete-old-apps'
          }
        }
      }
    }
  }
}
