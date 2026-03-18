import { codes } from '@europeana/i18n';

// Routes to exclude from i18n
export const exclude = [
  '/account/callback',
  '/account/login',
  '/account/logout'
];

const extractLocaleFromRoutePathRegExp = new RegExp(`^/(${codes.join('|')})((/|$).*$)`);

export const extractLocaleFromRoutePath = (routePath) => {
  const match = routePath.match(extractLocaleFromRoutePathRegExp);
  if (match) {
    const locale = match[1];
    let path = match[2];
    path = path === '' ? '/' : path;
    return { locale, path };
  } else {
    return { path: routePath };
  }
};
