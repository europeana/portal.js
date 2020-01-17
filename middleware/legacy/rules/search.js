// Redirect legacy search query parameters

export default (route, query) => {
  const pattern = /^(\/[a-z]{2})\/search$/;
  const match = route.path.match(pattern);
  if (!match) return null;

  if (!query || (!query.q && !query.f)) return null;

  const redirectRoute = { path: route.path, query: {} };
  if (query.q) {
    redirectRoute.query.query = query.q;
  }
  return redirectRoute;
};
