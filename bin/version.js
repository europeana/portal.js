import propertiesReader from 'properties-reader';

import pkg from '../package.json';

const versionSonarProjectProperties = async() => {
  const sonarProjectPropertiesFilePath = new URL('../sonar-project.properties', import.meta.url);
  const sonarProjectProperties = propertiesReader(sonarProjectPropertiesFilePath,
    'utf-8',
    { writer: { saveSections: false } }
  );
  sonarProjectProperties.set('sonar.projectVersion', pkg.version);
  await sonarProjectProperties.save(sonarProjectPropertiesFilePath);
};

const version = async() => {
  await versionSonarProjectProperties();
};

version();
