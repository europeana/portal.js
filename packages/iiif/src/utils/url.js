export const isInEuropeanaDomain = (id) => {
  const url = typeof(id) === 'string' ? new URL(id) : id;
  return url.origin.endsWith('.europeana.eu') ||
    url.origin.endsWith('.eanadev.org');
};

export const isForEuropeanaPresentationManifest = (id) => {
  const url = typeof(id) === 'string' ? new URL(id) : id;
  return isInEuropeanaDomain(id) && url.pathname.endsWith('/manifest');
};
