// Custom Nuxt auth scheme extending oAuth2 scheme to support Nuxt runtime config

// TODO: delete once auth module supports Nuxt runtime config
// @see https://github.com/nuxt-community/auth-module/issues/713

// This auth plugin will end up in .nuxt/auth/schemes, as will oauth2.js if it's
// also a registered strategy in the module config.
import Oauth2Scheme from './oauth2';

// Inspired by https://github.com/nuxt-community/auth-module/issues/713#issuecomment-724031930
export default class RuntimeConfigurableOauth2Scheme extends Oauth2Scheme {
  constructor($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options['_name']]
    };
    super($auth, configOptions);
  }
}
