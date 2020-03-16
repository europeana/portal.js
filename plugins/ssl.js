const config = {};

if (process.env.SSL_DATASET_BLACKLIST && process.env.SSL_DATASET_BLACKLIST !== '') {
  const datasetBlacklist = process.env.SSL_DATASET_BLACKLIST.split(',');
  config.datasetBlacklist = new RegExp(`^(${datasetBlacklist.join('|')})$`);
}

export const sslNegotiationEnabled = !Number(process.env['DISABLE_SSL_NEGOTIATION']);

export const routeOnDatasetBlacklist = route => {
  if (typeof route !== 'object' || !route) return false;
  if (!/^item-all(___[a-z]{2})?$/.test(route.name)) return false;

  const dataset = route.params.pathMatch.split('/')[0];

  return config.datasetBlacklist && config.datasetBlacklist.test(dataset);
};

export const routePermittedOnEitherScheme = route => {
  if (typeof route !== 'object' || !route) return false;
  return /^iiif(___[a-z]{2})?$/.test(route.name);
};
