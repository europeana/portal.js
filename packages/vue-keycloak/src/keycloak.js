// docs: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
import Keycloak from 'keycloak-js';

// TODO: stop using this.vm.$config.app.baseUrl, this.vm.$cookies

export default class VueKeycloak {
  static get keycloak() {
    if (!process.client) {
      return null;
    }
    if (!this._keycloak) {
      console.log('options', this.options)
      this._keycloak = new Keycloak(this.options);
    }
    return this._keycloak;
  }

  constructor(vm, options) {
    this.vm = vm;
    this.options = options;
  }

  get keycloak() {
    return this.constructor.keycloak;
  }

  // TODO: use this.keycloak.createLoginUrl instead
  get accountUrl() {
    const keycloakAccountUrl = new URL(this.options.url);

    keycloakAccountUrl.pathname = `${keycloakAccountUrl.pathname}/realms/${this.options.realm}/account`;
    if (keycloakAccountUrl.pathname.startsWith('//')) {
      keycloakAccountUrl.pathname = keycloakAccountUrl.pathname.slice(1);
    }

    const referrerUri = new URL(this.vm.$config.app.baseUrl);
    referrerUri.pathname = this.vm.$route.path;
    referrerUri.search = new URLSearchParams(this.vm.$route.query).toString();
    referrerUri.hash = this.vm.$route.hash;

    keycloakAccountUrl.search = new URLSearchParams({
      referrer: this.options.clientId,
      'referrer_uri': referrerUri.toString()
    }).toString();

    return keycloakAccountUrl.toString();
  }

  callback() {
    let redirect = '/';

    if (this.vm.$route.query.redirect?.startsWith('/')) {
      redirect = this.vm.$route.query.redirect;
    }

    this.vm.$router.replace(redirect);
  }

  async init() {
    console.log('init keycloak')
    try {
      await this.keycloak.init({
        checkLoginIframe: false,
        token: this.vm.$cookies.get('kc.token'),
        idToken: this.vm.$cookies.get('kc.idToken'),
        refreshToken: this.vm.$cookies.get('kc.refreshToken')
      });
    } catch (e) {
      this.vm.$cookies.remove('kc.token');
      this.vm.$cookies.remove('kc.idToken');
      this.vm.$cookies.remove('kc.refreshToken');
      await this.keycloak.init({
        checkLoginIframe: false
      });
    }

    this.vm.$store.commit('keycloak/setLoggedIn', this.keycloak.authenticated);

    this.vm.$cookies.set('kc.token', this.keycloak.token);
    this.vm.$cookies.set('kc.idToken', this.keycloak.idToken);
    this.vm.$cookies.set('kc.refreshToken', this.keycloak.refreshToken);

    if (this.keycloak.authenticated) {
      const profile = await this.keycloak.loadUserProfile();
      this.vm.$store.commit('keycloak/setProfile', profile);
      this.vm.$store.commit('keycloak/setResourceAccess', this.keycloak.resourceAccess);
    }
  }
  localePath(path) {
    return `/${this.vm.$i18n.locale}${path}`;
  }
  login() {
    console.log('this.keycloak', this.keycloak)
    this.keycloak.login({
      locale: this.vm.$i18n.locale,
      redirectUri: this.loginRedirect
    });
  }
  get loginRedirect() {
    let redirectPath = this.localePath('/account');

    if (this.vm.$route) {
      if ((this.vm.$route.query?.redirect || '').startsWith('/')) {
        redirectPath = this.vm.$route.query.redirect;
      } else if (this.vm.$route.path === this.localePath('/account/login')) {
        redirectPath = this.localePath('/account');
      } else {
        redirectPath = this.vm.$route.fullPath;
      }
    }

    const redirectUrl = new URL(`${this.vm.$config.app.baseUrl}${this.localePath('/account/callback')}`);
    redirectUrl.searchParams.set('redirect', redirectPath);

    return redirectUrl.toString();
  }
  logout() {
    this.keycloak.logout({
      redirectUri: this.logoutRedirect,
      'ui_locales': this.vm.$i18n.locale
    });
  }
  get logoutRedirect() {
    let redirectPath = this.localePath('/');

    if ((this.vm.$route.query?.redirect || '').startsWith('/')) {
      redirectPath = this.vm.$route.query.redirect;
    } else if (this.vm.$route.fullPath) {
      redirectPath = this.vm.$route.fullPath;
    }

    const redirectUrl = new URL(`${this.vm.$config.app.baseUrl}${this.localePath('/account/callback')}`);
    redirectUrl.searchParams.set('redirect', redirectPath);

    return redirectUrl.toString();
  }
  get logoutRoute() {
    let redirect = '/';
    if (!this.vm.$route.name.startsWith('account')) {
      redirect = this.vm.$route.fullPath;
    }
    return {
      name: 'account-logout',
      query: {
        redirect
      }
    };
  }
}
