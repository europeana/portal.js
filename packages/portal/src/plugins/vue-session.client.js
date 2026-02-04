import Vue from 'vue';
import VueSession from '@europeana/vue-session';

Vue.use(VueSession, { storage: { prefix: 'europeana.' } });
