import fs from 'fs';

const PROPERTIES = [
  { id: 'name', required: true },
  { id: 'oembed' },
  { id: 'purpose', required: true },
  { id: 'responsive', boolean: true, dependsOn: 'oembed' },
  { id: 'schemes', required: true, split: true },
  { id: 'title', required: true }
];

function propertyEnvVarName(id) {
  return `SERVICE_${id.toUpperCase()}`;
}

function readProperty(id) {
  return process.env[propertyEnvVarName(id)];
}

function readService() {
  const service = {};

  for (const prop of PROPERTIES) {
    service[prop.id] = readProperty(prop.id);

    if (prop.required && !service[prop.id]) {
      console.error(`${propertyEnvVarName(prop.id)} is required`);
      process.exit(1);
    }

    if (prop.boolean) {
      service[prop.id] = service[prop.id] === 'true';
    }

    if (prop.split) {
      service[prop.id] = service[prop.id].split(',');
    }
  }

  for (const prop of PROPERTIES) {
    if (prop.dependsOn && !service[prop.dependsOn]) {
      delete service[prop.id];
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
