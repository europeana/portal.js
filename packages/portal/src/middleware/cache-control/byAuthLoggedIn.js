import privateCacheControl from './private.js';
import publicCacheControl from './public.js';

export default (ctx) => {
  console.log('ctx?.$auth?.loggedIn', ctx?.$auth?.loggedIn);
  return ctx?.$auth?.loggedIn ? privateCacheControl(ctx) : publicCacheControl(ctx);
};
