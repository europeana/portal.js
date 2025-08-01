import { afterFrame } from '@elastic/apm-rum-core';

/**
 * Based on `@elastic/apm-rum-vue` package's `src/route-hooks.js`
 * with optional support for replacement of locale codes in route path to group
 * transactions with locale as prefix, e.g. from nuxt-i18n.
 */
export const routeHooks = (router, apm, options = {}) => {
  let transaction;

  router.beforeEach((to, from, next) => {
    const parsed = parseRoute(to, options);
    transaction = apm.startTransaction(parsed.path, 'route-change', {
      managed: true,
      canReuse: true
    });
    if (parsed.locale) {
      transaction.addLabels('locale', parsed.locale);
    }
    next();
  });

  router.afterEach(() => {
    afterFrame(() => transaction?.detectFinish());
  });

  /**
   * handle when the navigation is cancelled in `beforeEach` hook of components
   * where `next(error)` is called
   */
  router.onError(() => {
    transaction?.end();
  });
};

export const parseRoute = (route, options = {}) => {
  const parsed = { path: route.path };
  const matched = route.matched || [];

  /**
   * Get the last matched route record which acts as stack when
   * route changes are pushed and popped out of the stack
   *
   * Also account for the slug pattern on the routes, to.path always
   * resolves the current slug param, but we need need to
   * use the slug pattern for the transaction name
   */
  if (matched.length > 0) {
    parsed.path = matched[matched.length - 1].path || parsed.path;
  }

  /**
   * Replace supported locales at start of path with ":locale"
   */
  if (options.localeCodes) {
    const localePattern = new RegExp(`^/(${options.localeCodes.join('|')})(/|$)`);
    const localeMatch = parsed.path.match(localePattern);
    if (localeMatch) {
      parsed.path = parsed.path.replace(localePattern, '/:locale$2');
      parsed.locale = localeMatch[1];
    }
  }

  return parsed;
};
