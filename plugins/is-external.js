export default (path) => {
  if (typeof path !== 'string' || path.startsWith('/')) return;

  const internalDomain = process.env.INTERNAL_LINK_DOMAIN;
  return !path.includes(internalDomain);
};
