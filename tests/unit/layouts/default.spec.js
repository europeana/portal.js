import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import layout from '../../../layouts/default';
import { klaroConfig } from '../../../plugins/klaro-config';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  state: { breadcrumb: {} }
});

const factory = () => shallowMount(layout, {
  localVue,
  store,
  data() {
    return {
      enableAnnouncer: true
    };
  },
  mocks: {
    $t: key => key,
    $announcer: {
      setComplementRoute: () => {}
    }
  },
  stubs: {
    CookieDisclaimer: true,
    VueAnnouncer: { template: '<div id="announcer" aria-live="polite"></div>' },
    nuxt: true,
    PageHeader: true,
    PageFooter: true,
    // Klaro: process.client && typeof window.klaro !== 'undefined' ? window.klaro.render(klaroConfig, true) : null,
    Klaro: { template: '<div id="eu-klaro"></div>' }
  }
});

describe('layouts/default.vue', () => {
  describe('VueAnnouncer', () => {
    it('is enabled', () => {
      const wrapper = factory();
      wrapper.find('#announcer').exists().should.equal(true);
    });
  });
  describe('Klaro', () => {
    it('is enabled', () => {
      const wrapper = factory();
      wrapper.find('#eu-klaro').exists().should.equal(true);
    });
  });
});
