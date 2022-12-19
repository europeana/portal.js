export default ({ route, redirect }) => {
  const routePathParts = route.path.split('/');
  if (routePathParts[2] === 'set') {
    return redirect(`/${routePathParts[1]}/galleries/${routePathParts.slice(3).join('/')}`);
  }
};
