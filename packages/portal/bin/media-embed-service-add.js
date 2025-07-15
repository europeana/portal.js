import fs from 'fs';

const PROPERTIES = [
  { id: 'name', required: true },
  { id: 'oembed' },
  { id: 'purpose', required: true },
  { id: 'schemes', required: true, split: true },
  { id: 'title', required: true }
];

function readService() {
  const service = {};

  for (const prop of PROPERTIES) {
    const envVarName = `SERVICE_${prop.id.toUpperCase()}`;

    if (process.env[envVarName]) {
      service[prop.id] = process.env[envVarName];
    } else if (prop.required) {
      console.error(`${envVarName} is required`);
      process.exit(1);
    }

    if (prop.split) {
      service[prop.id] = service[prop.id].split(',');
    }
  }

  return service;
}

const service = readService();

const servicePurpose = service.purpose;
delete service.purpose;

const serviceDefinitionsFile = new URL(`../src/utils/services/definitions/${servicePurpose}.json`, import.meta.url);
let services = JSON.parse(fs.readFileSync(serviceDefinitionsFile, { encoding: 'utf8' }));

// TODO: detect if the named service already exists, and if so, update its properties

services.push(service);

services = services.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(serviceDefinitionsFile, JSON.stringify(services, null, 2));
