import propertiesReader from 'properties-reader';

import versions from '../pkg-versions.js';

const versionSonarProjectProperties = async() => {
  const sonarProjectPropertiesFilePath = new URL('../sonar-project.properties', import.meta.url);
  const sonarProjectProperties = propertiesReader(sonarProjectPropertiesFilePath,
    'utf-8',
    { writer: { saveSections: false } }
  );
  sonarProjectProperties.set('sonar.projectVersion', versions['@europeana/portal']);
  await sonarProjectProperties.save(sonarProjectPropertiesFilePath);
};

const version = async() => {
  await versionSonarProjectProperties();
};

version();
