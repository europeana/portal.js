import escapeRegExp from 'lodash/escapeRegExp.js';
import services from './cookies';

const servicesWithSchemes = services.filter(service => service.schemes);

for (const service of servicesWithSchemes) {
  service.schemeRegExps = service.schemes.map((scheme) => {
    const escaped = escapeRegExp(scheme).replace(/\\\*/g, '.+');
    return new RegExp(escaped);
  });
}

function serviceSupportsUrl(service, url) {
  for (const schemeRegExp of service.schemeRegExps) {
    if (schemeRegExp.test(url)) {
      return true;
    }
  }
  return false;
}

function serviceForUrl(url) {
  for (const service of servicesWithSchemes) {
    if (serviceSupportsUrl(service, url)) {
      return service;
    }
  }
  return null;
}

export default serviceForUrl;
