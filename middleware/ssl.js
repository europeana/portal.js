// TODO: redirects should strip port from host and replace with customisable
//       port for other scheme

const config = {
  eitherSchemeWhitelist: new RegExp('^/[a-z]{2}/iiif(\\?|$)')
};

if (process.env.SSL_DATASET_BLACKLIST && process.env.SSL_DATASET_BLACKLIST !== '') {
  const datasetBlacklist = process.env.SSL_DATASET_BLACKLIST.split(',');
  config.datasetBlacklist = new RegExp(`^/[a-z]{2}/item/(${datasetBlacklist.join('|')})/`);
}

const routeOnDatasetBlacklist = route => {
  return config.datasetBlacklist && config.datasetBlacklist.test(route.fullPath);
};

const routePermittedOnEitherScheme = route => {
  return config.eitherSchemeWhitelist.test(route.fullPath);
};

export default ({ route, redirect, req }) => {
  if (routePermittedOnEitherScheme(route)) return;

  let ssl;
  let host;

  if (process.server) {
    ssl = require('is-https')(req, true);
    host = req.headers['X-Forwarded-Host'] || req.headers.host;
  } else if (process.client) {
    ssl = (window.location.protocol === 'https:');
    host = window.location.host;
  } else {
    return;
  }

  const routeBlacklisted = routeOnDatasetBlacklist(route);

  if (ssl && routeBlacklisted) {
    // redirect to non-ssl
    return redirect(`http://${host}${route.fullPath}`);
  } else if (!ssl && !routeBlacklisted) {
    // redirect to ssl
    return redirect(`https://${host}${route.fullPath}`);
  }
};
