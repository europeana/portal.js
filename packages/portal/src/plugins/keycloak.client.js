import Keycloak from 'keycloak-js';

export default async(ctx, inject) => {
  const config = ctx.$config.keycloak;

  const keycloak = new Keycloak(config);

  try {
    await keycloak.init({
      checkLoginIframe: false,
      token: localStorage.getItem('kc.token'),
      idToken: localStorage.getItem('kc.idToken'),
      refreshToken: localStorage.getItem('kc.refreshToken')
    });
    // if (keycloak.authenticated) {
    //   keycloak.login();
    // }
  } catch (e) {
    localStorage.removeItem('kc.token');
    localStorage.removeItem('kc.idToken');
    localStorage.removeItem('kc.refreshToken');
    await keycloak.init({
      checkLoginIframe: false
    });
  }

  console.log('keycloak', keycloak)

  ctx.store.commit('auth/setLoggedIn', keycloak.authenticated);

  // TODO: logout needs to clear these
  localStorage.setItem('kc.token', keycloak.token);
  localStorage.setItem('kc.idToken', keycloak.idToken);
  localStorage.setItem('kc.refreshToken', keycloak.refreshToken);

  if (keycloak.authenticated) {
    const profile = await keycloak.loadUserProfile();
    ctx.store.commit('auth/setProfile', profile);
    ctx.store.commit('auth/setResourceAccess', keycloak.resourceAccess);
  }

  inject('keycloak', keycloak);
};
