import Vue from 'vue';
import VueKeycloak, { vuex } from '@europeana/vue-keycloak';

export default async(ctx, inject) => {
  ctx.store.registerModule('keycloak', vuex);
  ctx.store.commit('keycloak/setLoggedIn', !!ctx.$cookies.get('kc.token'));

  Vue.use(VueKeycloak, ctx.$config.keycloak);
  // inject('keycloak', await plugin(ctx));
};
