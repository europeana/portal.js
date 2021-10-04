import apm from 'elastic-apm-node';

// Server-side plugin to set the transaction name based on the Vue route.
export default ({ route, req }) => {
  if (!apm.isStarted())  {
    return;
  }

  // Path deduction logic courtesy of `@elastic/apm-rum-vue` package's `src/route-hooks.js`
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

  apm.setTransactionName(`${req.method} ${path}`);
};
