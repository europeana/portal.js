export default ({ route, redirect }) => {
  let routePath = route.path;
  if ((routePath !== '/') && routePath.endsWith('/')) {
    routePath = routePath.slice(0, -1);
    redirect(301, routePath);
  }
};
