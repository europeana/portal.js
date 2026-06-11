import { parse, serialize } from 'cookie';

export default (ctx, inject) => {
  const ctxCookie = () => {
    return (ctx.req ? ctx.req.headers.cookie : document.cookie) || '';
  };

  const plugin = {
    get(name) {
      return parse(ctxCookie())[name];
    },

    remove(name) {
      // FIXME: is this leaving unnamed "undefined" cookies in the browser?
      this.set(name, '', { maxAge: 0 });
    },

    set(name, value, options = {}) {
      options = {
        path: '/',
        ...options
      };

      const serialized = serialize(name, value, options);

      if (ctx.res) {
        // FIXME: this needs to remove any others of the same name...
        ctx.res.setHeader('set-cookie', [].concat(ctx.res.getHeader('set-cookie'), serialized));
      } else {
        document.cookie = serialized;
      }
    }
  };

  inject('cookies', plugin);
};
