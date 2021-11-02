export default ({ route, redirect }) => {
  if ((route.path !== '/') && route.path.endsWith('/')) {
    const redirectRoute = { ...route };
    redirectRoute.path = redirectRoute.path.slice(0, -1);
    return redirect(redirectRoute);
  }
};
