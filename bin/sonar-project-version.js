import propertiesReader from 'properties-reader';

const versionSonarProjectProperties = async() => {
  const sonarProjectPropertiesFilePath = new URL('../sonar-project.properties', import.meta.url);
  const sonarProjectProperties = propertiesReader(sonarProjectPropertiesFilePath,
    'utf-8',
    { writer: { saveSections: false } }
  );
  sonarProjectProperties.set('sonar.projectVersion', process.env.npm_package_version);
  await sonarProjectProperties.save(sonarProjectPropertiesFilePath);
};

const version = async() => {
  await versionSonarProjectProperties();
};

version();
