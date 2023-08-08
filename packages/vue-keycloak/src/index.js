import VueKeycloak from './keycloak.js';
import vuex from './vuex.js';

function install(Vue, options) {
  console.log('[vue-keycloak pkg install] installing vue-keycloak with options', options.keycloak)

  if (!Vue.prototype.hasOwnProperty('$keycloak')) {
    Object.defineProperty(Vue.prototype, '$keycloak', {
      get() {
        if (!this._keycloak) {
          this._keycloak = new VueKeycloak(this, options.keycloak)
        }
        return this._keycloak;
      }
    })
  }

  options.store.registerModule('keycloak', vuex);
}

export default {
  install
};
