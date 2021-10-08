import { afterFrame } from '@elastic/apm-rum-core';

/**
 * Based on `@elastic/apm-rum-vue` package's `src/route-hooks.js`
 * with optional support for replacement of locale codes in route path to group
 * transactions with locale as prefix, e.g. from nuxt-i18n.
 */
export const routeHooks = (router, apm, options = {}) => {
  let transaction;

  router.beforeEach((to, from, next) => {
    const path = transactionPath(to, options);
    transaction = apm.startTransaction(path, 'route-change', {
      managed: true,
      canReuse: true
    });
    next();
  });

  router.afterEach(() => {
    afterFrame(() => transaction && transaction.detectFinish());
  });

  /**
   * handle when the navigation is cancelled in `beforeEach` hook of components
   * where `next(error)` is called
   */
  router.onError(() => {
    transaction && transaction.end();
  });
};

export const transactionPath = (route, options = {}) => {
  const matched = route.matched || [];
  let path = route.path;

  /**
   * Get the last matched route record which acts as stack when
   * route changes are pushed and popped out of the stack
   *
   * Also account for the slug pattern on the routes, to.path always
   * resolves the current slug param, but we need need to
   * use the slug pattern for the transaction name
   */
  if (matched.length > 0) {
    path = matched[matched.length - 1].path || path;
  }

  /**
   * Replace supported locales at start of path with ":locale"
   */
  if (options.localeCodes) {
    const pattern = new RegExp(`^/(${options.localeCodes.join('|')})(/|$)`);
    path = path.replace(pattern, '/:locale$2');
  }

  return path;
};
