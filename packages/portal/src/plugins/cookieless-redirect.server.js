// Redirects do not need cookies, e.g. for auth or i18n, set,
// so remove them, facilitating caching by search engines and
// proxies.
export default (ctx) => {
  const redirect = ctx.redirect;

  ctx.redirect = (status, path, query) => {
    ctx.res.removeHeader('Set-Cookie');

    redirect(status, path, query);
  };
};
