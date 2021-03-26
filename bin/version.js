const path = require('path');
const propertiesReader = require('properties-reader');

const pkgVersion = require('../package').version;

const versionSonarcloudProperties = async() => {
  const sonarcloudPropertiesFilePath = path.resolve(__dirname, '../.sonarcloud.properties');
  const sonarcloudProperties = propertiesReader(sonarcloudPropertiesFilePath,
    'utf-8',
    { writer: { saveSections: false } }
  );
  sonarcloudProperties.set('sonar.projectVersion', pkgVersion);
  await sonarcloudProperties.save(sonarcloudPropertiesFilePath);
};

const version = async() => {
  await versionSonarcloudProperties();
};

version();
