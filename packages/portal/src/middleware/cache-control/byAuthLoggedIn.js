import noStoreCacheControl from './no-store.js';
import noCacheControl from './none.js';

export default (ctx) => {
  return ctx?.$auth?.loggedIn ? noStoreCacheControl(ctx) : noCacheControl(ctx);
};
