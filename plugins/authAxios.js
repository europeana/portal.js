import sets from './europeana/sets';
import { apiError } from './europeana/utils';

export default function(ctx, inject) {
  const token = ctx.$auth.getToken('keycloak');
  const redirectUrl = ctx.$auth.options.redirect.login;

  ctx.$axios.setHeader('Authorization', token);

  // interceptor for when user is not logged in but token is still valid for sets api
  ctx.$axios.onRequest(config => {
    if (!ctx.$auth.loggedIn) {
      ctx.redirect(redirectUrl);
    }
    return config;
  });

  ctx.$axios.onError(error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return ctx.redirect(redirectUrl);
    }
    throw apiError(error);
  });

  const setsWithAxios = sets(ctx.$axios);

  inject('galleries', setsWithAxios);
}

