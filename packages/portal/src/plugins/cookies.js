import cookie from 'cookie';
import kebabCase from 'lodash/kebabCase.js';

export default (ctx, inject) => {
  const ctxCookie = () => {
    return ctx.req ? ctx.req.headers.cookie : document.cookie;
  }

  const plugin = {
    get(name) {
      return cookie.parse(ctxCookie())[name];
    },

    set(name, value, options = {}) {
      const serialized = cookie.serialize(name, value, options);
      if (ctx.res) {
        ctx.res.setHeader('set-cookie', ctx.res.getHeader('set-cookie').concat(serialized));
      } else {
        document.cookie = serialized;
      }
    }
  }

  inject('cookies', plugin);
};
