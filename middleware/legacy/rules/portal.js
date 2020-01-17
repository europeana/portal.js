// Remove legacy /portal prefix

export default (route) => {
  const legacyPortalPrefixPattern = /^\/portal(\/.*)$/;
  const legacyPortalPrefixMatch = route.path.match(legacyPortalPrefixPattern);
  return legacyPortalPrefixMatch ? { path: legacyPortalPrefixMatch[1] } : null;
};
