pipeline {
  options {
    disableConcurrentBuilds()
  }
  agent {
    dockerfile {
      dir 'docker/deploy'
      args "-u node:node"
    }
  }
  environment {
    CF_HOME='/home/node' // Revert override from Jenkins global env
    CF_API="${env.CF_API}"
    CF_LOGIN=credentials('portaljs.cloudfoundry.login')
    CF_ORG="${env.CF_ORG}"
    CF_SPACE="${env.BRANCH_NAME ==~ /\Av\d+\.\d+\.\d+\z/ ? 'production' : 'test'}"
  }
  stages {
    stage('Build') {
      steps {
        configFileProvider([
          configFile(fileId: "portaljs.${env.CF_SPACE}.env", targetLocation: '.env'),
          configFile(fileId: "portaljs.${env.CF_SPACE}.apisrc.js", targetLocation: '.apisrc.js')
        ]) {
          sh 'rm -rf node_modules'
          sh 'npm install'
          sh 'npm run build'
        }
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
