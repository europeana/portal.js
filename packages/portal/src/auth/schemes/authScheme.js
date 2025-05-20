// Custom Nuxt auth scheme extending @nuxtjs/auth's oAuth2 scheme to:
// - support Nuxt runtime config
// - _replace_ the window location for redirection to oAuth login endpoint

import nanoid from 'nanoid';

// TODO: delete once auth module supports Nuxt runtime config
// @see https://github.com/nuxt-community/auth-module/issues/713

// When Nuxt is built, this custom auth plugin will end up in .nuxt/auth/schemes,
// as will @nuxtjs/auth/lib/schemes/oauth2.js if it's also a registered strategy
// in the auth module config (in nuxt.config.js).
import Oauth2Scheme from './oauth2';

const keycloakOpenIDConnectEndpoint = (method, { realm, origin }) =>
  `${origin}/auth/realms/${realm}/protocol/openid-connect/${method}`;

export function userHasClientRole(client, role) {
  return this.user?.resource_access?.[client]?.roles?.includes(role) || false;
}

// Inspired by https://github.com/nuxt-community/auth-module/issues/713#issuecomment-724031930
export default class RuntimeConfigurableOauth2Scheme extends Oauth2Scheme {
  constructor($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx?.$config?.auth?.strategies[options['_name']]
    };

    configOptions['authorization_endpoint'] = keycloakOpenIDConnectEndpoint('auth', configOptions);
    configOptions['access_token_endpoint'] = keycloakOpenIDConnectEndpoint('token', configOptions);
    configOptions['userinfo_endpoint'] = keycloakOpenIDConnectEndpoint('userinfo', configOptions);
    configOptions['end_session_endpoint'] = keycloakOpenIDConnectEndpoint('logout', configOptions);

    if (typeof $auth.userHasClientRole !== 'function') {
      $auth.userHasClientRole = userHasClientRole;
    }

    super($auth, configOptions);
  }

  // copied from @nuxtjs/auth/lib/schemes/oauth2.js, modified to use
  // `window.location.replace(url)` for the redirection (instead of `window.location = url`)
  login({ params, state, nonce } = {}) {
    const opts = {
      protocol: 'oauth2',
      'response_type': this.options.response_type,
      'access_type': this.options.access_type,
      'client_id': this.options.client_id,
      'redirect_uri': this['_redirectURI'],
      scope: this['_scope'],
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: state || nanoid(),
      ...params
    };

    if (this.options.audience) {
      opts.audience = this.options.audience;
    }

    // Set Nonce Value if response_type contains id_token to mitigate Replay Attacks
    // More Info: https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
    // More Info: https://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-06#section-4.6.2
    if (opts.response_type.includes('id_token')) {
      // nanoid auto-generates an URL Friendly, unique Cryptographic string
      // Recommended by Auth0 on https://auth0.com/docs/api-auth/tutorials/nonce
      opts.nonce = nonce || nanoid();
    }

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state);

    const url = new URL(this.options.authorization_endpoint);
    url.search = new URLSearchParams(opts).toString();

    window.location.replace(url);
  }
}
