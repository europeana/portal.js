import fs from 'fs';
import lernaJson from '../lerna.json' assert { type: 'json' };

const versionSonarProjectProperties = () => {
  const sonarProjectPropertiesFilePath = new URL('../sonar-project.properties', import.meta.url);

  let sonarProjectProperties = fs.readFileSync(sonarProjectPropertiesFilePath, { encoding: 'utf8' });
  sonarProjectProperties = sonarProjectProperties.replace(/sonar\.projectVersion=.*/, `sonar.projectVersion=${lernaJson.version}`);

  fs.writeFileSync(sonarProjectPropertiesFilePath, sonarProjectProperties);
};

versionSonarProjectProperties();
