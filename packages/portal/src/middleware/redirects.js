const redirects = {
  '/exhibitions': '/stories?type=exhibition',
  '/privacy-policy-newsletter': '/privacy-statement-newsletter',
  '/professionals': '/share-your-collections',
  '/rights/privacy-policy': '/rights/privacy-statement',
  '/rights/public-domain-charter': 'https://pro.europeana.eu/post/the-europeana-public-domain-charter',
  '/share-your-data': '/share-your-collections'
};

export default ({ redirect, route }) => {
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
      if (redirectTo.startsWith('/')) {
        return redirect(`/${locale}${redirectTo}`);
      } else {
        return redirect(redirectTo);
      }
    }
  }

  return null;
};
