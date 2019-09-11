const chai = require('chai');
chai.use(require('chai-string'));
chai.should();
global.should = chai.should;

import { createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
const localVue = createLocalVue();
localVue.use(VueI18n);
global.i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('../../lang/en').default
  }
});

import('../../plugins/vue-filters');
