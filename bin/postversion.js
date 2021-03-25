const path = require('path');
const propertiesReader = require('properties-reader');

const version = require('../package').version;

const versionSonarcloudProperties = async() => {
  const sonarcloudPropertiesFilePath = path.resolve(__dirname, '../.sonarcloud.properties');
  const sonarcloudProperties = propertiesReader(sonarcloudPropertiesFilePath);
  sonarcloudProperties.set('sonar.projectVersion', version);
  await sonarcloudProperties.save(sonarcloudPropertiesFilePath);
};

const postversion = async() => {
  await versionSonarcloudProperties();
};

postversion();
