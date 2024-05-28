export default ({ redirect, route, $features }) => {
  const redirects = {
    '/professionals': '/share-your-data'
  };
  if ($features?.redirectBlogsToStories) {
    redirects['/blog'] = '/stories';
    redirects['/blog/*'] = '/stories/*';
  }

  for (const redirectFrom in redirects) {
    let redirectTo = redirects[redirectFrom];

    const routePathParts = route.path.split('/');
    const locale = routePathParts[1];
    const localelessPath = `/${routePathParts.slice(2).join('/')}`;

    let match;
    if (redirectFrom.endsWith('*')) {
      const redirectFromPrefix = redirectFrom.slice(0, -1);
      match = localelessPath.startsWith(redirectFromPrefix);
      if (redirectTo.endsWith('*')) {
        const redirectToPrefix = redirectTo.slice(0, -1);
        const redirectToSuffix = localelessPath.slice(redirectFromPrefix.length);
        redirectTo = `${redirectToPrefix}${redirectToSuffix}`;
      }
    } else {
      match = localelessPath === redirectFrom;
    }

    if (match) {
      return redirect(`/${locale}${redirectTo}`);
    }
  }

  return null;
};
