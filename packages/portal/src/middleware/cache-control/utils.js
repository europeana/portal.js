export const setCacheControl = (ctx, callback) => {
  const config = ctx.$config?.app?.cacheControl || {};

  if (!config.enabled || !ctx.res) {
    return;
  }

  const headerValue = callback(config);

  if (!headerValue) {
    return;
  }

  ctx.res?.removeHeader('Cache-Control');
  ctx.res?.setHeader('Cache-Control', headerValue);
};
