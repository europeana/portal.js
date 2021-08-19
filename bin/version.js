import path from 'path';
import propertiesReader from 'properties-reader';

import pkg from '../package.json';

const versionSonarcloudProperties = async() => {
  const sonarcloudPropertiesFilePath = path.resolve(__dirname, '../.sonarcloud.properties');
  const sonarcloudProperties = propertiesReader(sonarcloudPropertiesFilePath,
    'utf-8',
    { writer: { saveSections: false } }
  );
  sonarcloudProperties.set('sonar.projectVersion', pkg.version);
  await sonarcloudProperties.save(sonarcloudPropertiesFilePath);
};

const version = async() => {
  await versionSonarcloudProperties();
};

version();
