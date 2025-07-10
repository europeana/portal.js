import fs from 'fs';

const serviceName = process.env.SERVICE_NAME;
if (!serviceName) {
  console.error('SERVICE_NAME is required');
  process.exit(1);
}
const servicePurpose = process.env.SERVICE_PURPOSE;
if (!servicePurpose) {
  console.error('SERVICE_PURPOSE is required');
  process.exit(1);
}
const serviceSchemes = (process.env.SERVICE_SCHEMES || '').split(',');
if (serviceSchemes.length === 0) {
  console.error('SERVICE_SCHEMES is required');
  process.exit(1);
}
const serviceOembed = process.env.SERVICE_OEMBED;

const serviceDefinitionsFile = new URL(`../src/utils/services/definitions/${servicePurpose}.json`, import.meta.url);
const services = JSON.parse(fs.readFileSync(serviceDefinitionsFile, { encoding: 'utf8' }));
const service = {
  name: serviceName,
  schemes: serviceSchemes
};
if (serviceOembed) {
  service.oembed = serviceOembed;
}
services.push(service);

fs.writeFileSync(serviceDefinitionsFile, JSON.stringify(services, null, 2));
