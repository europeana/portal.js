import axios from './axios.js';
import VueKeycloak from './keycloak.js';
import vuex from './vuex.js';

export {
  axios,
  vuex
};

export default {
  install: (Vue, options) => {
    console.log('installing vue-keycloak with options', options)
    Object.defineProperty(Vue.prototype, '$keycloak', {
      get() {
        if (!this._keycloak) {
          console.log('initialisting $keycloak on', this);
          this._keycloak = new VueKeycloak(this, options);
        }
        return this._keycloak;
      }
    })
  }
};
