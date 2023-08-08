import Vue from 'vue';
import VueKeycloak, { vuex } from '@europeana/vue-keycloak';

export default async(ctx) => {
  console.log('registering Nuxt plugin vue-keycloak with options', ctx.$config.keycloak)
  Vue.use(VueKeycloak, { store: ctx.store, keycloak: ctx.$config.keycloak });
  ctx.store.commit('keycloak/setLoggedIn', !!ctx.$cookies.get('kc.token'));
};
