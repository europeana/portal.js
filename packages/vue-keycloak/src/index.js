import axios from './axios.js';
import VueKeycloak from './keycloak.js';
import vuex from './vuex.js';

function install(Vue, options) {
  console.log('[vue-keycloak pkg install] installing vue-keycloak with options', options)

  if (!Vue.prototype.hasOwnProperty('$keycloak')) {
      get() {
        if (!this._keycloak) {
          this._keycloak = new VueKeycloak(this, options)
        }
        return this._keycloak;
      }
    })
  }
}

export default {
  install
};

export {
  axios,
  vuex
};
