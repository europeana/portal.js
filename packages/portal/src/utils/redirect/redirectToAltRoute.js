export const redirectToAltRoute = (changes = {}, { redirect, route, status = 302 }) => {
  const redirectRoute = {
    hash: route.hash || '',
    name: route.name || '',
    params: route.params || {},
    query: route.query || {},
    // _Replace_ history entry on client-side, to prevent interference with back button
    replace: true,
    ...changes
  };

  redirect(status, redirectRoute);
};
