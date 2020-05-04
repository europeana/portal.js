import Vue from 'vue';

import VueScrollTo from 'vue-scrollto';

import facets from './facets';
import i18n from './i18n';
import proxyMedia from './proxy-media';

Vue.use(VueScrollTo);
Vue.use(facets);
Vue.use(i18n);
Vue.use(proxyMedia);
