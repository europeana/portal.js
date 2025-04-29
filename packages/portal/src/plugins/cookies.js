import cookie from 'cookie';

export default (ctx, inject) => {
  const ctxCookie = () => {
    return (ctx.req ? ctx.req.headers.cookie : document.cookie) || '';
  };

  const plugin = {
    get(name) {
      return cookie.parse(ctxCookie())[name];
    },

    set(name, value, options = {}) {
      options = {
        path: '/',
        ...options
      };

      const serialized = cookie.serialize(name, value, options);

      if (ctx.res) {
        ctx.res.setHeader('set-cookie', [].concat(ctx.res.getHeader('set-cookie'), serialized));
      } else {
        document.cookie = serialized;
      }
    }
  };

  inject('cookies', plugin);
};
