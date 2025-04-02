// import * as openidClient from 'openid-client';

const openidClientPlugin = (ctx) => ({

});

export default (ctx, inject) => {
  inject('openid', openidClientPlugin(ctx));
};
