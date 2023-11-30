const redirects = {
  'professionals': 'share-your-data'
};

export default ({ route, redirect }) => {
  for (const redirectFrom in redirects) {
    const routePathParts = route.path.split('/');
    const match = routePathParts[2] === redirectFrom;
    const redirectTo = redirects[redirectFrom];

    if (match) {
      return redirect(`/${routePathParts[1]}/${redirectTo}`);
    }
  }
  return null;
};
