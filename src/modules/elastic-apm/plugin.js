import Vue from 'vue';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import { apm } from '@elastic/apm-rum';
import { afterFrame } from '@elastic/apm-rum-core';
import { transactionPath } from './utils';

/**
 * Based on `@elastic/apm-rum-vue` package's `src/route-hooks.js`
 */
const routeHooks = (router, apm, options = {}) => {
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

export default ({ app, $config }) => {
  const config = ($config && $config.elastic ? $config.elastic.apm : undefined) || {};

  if (!config.serverUrl) {
    return;
  }

  Vue.use(ApmVuePlugin, {
    config
  });

  if (apm.isActive()) {
    routeHooks(app.router, apm, { localeCodes: app.i18n?.localeCodes });
  }
};
