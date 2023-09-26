export const isInEuropeanaDomain = (id) => {
  const url = new URL(id);
  return url.origin.endsWith('.europeana.eu') ||
    url.origin.endsWith('.eanadev.org');
};

export const isForEuropeanaPresentationManifest = (id) => {
  const url = new URL(id);
  return isInEuropeanaDomain && url.pathname.endsWith('/manifest');
};
