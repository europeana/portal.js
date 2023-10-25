export default ({ route, redirect }) => {
  const routePathParts = route.path.split('/');
  if (routePathParts[2] === 'professionals') {
    return redirect(`/${routePathParts[1]}/share-your-data`);
  }
};
