import { extractLocaleFromRoutePath } from '@/i18n/routes.js';

export default ({ route, redirect }) => {
  const { locale, path: localelessPath } = extractLocaleFromRoutePath(route.path);

  const localelessPathParts = localelessPath.split('/');

  if (localelessPathParts[1] === 'set') {
    let redirectPath = `/galleries/${localelessPathParts.slice(2).join('/')}`;

    if (locale) {
      redirectPath = `/${locale}${redirectPath}`;
    }

    return redirect(301, redirectPath);
  }
};
