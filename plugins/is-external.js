export default (domain) => {
  const internalDomain = process.env.INTERNAL_LINK_DOMAIN;
  return domain.indexOf(internalDomain) === -1;
};
