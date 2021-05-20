import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import layout from '../../../src/layouts/default';

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
    $auth: {
      $storage: {
        getUniversal: sinon.spy()
      }
    },
    $announcer: {
      setComplementRoute: () => {}
    },
    $config: { app: { features: {} } },
    $exp: {
      $variantIndexes: [0]
    },
    $route: {
      query: {}
    }
  },
  stubs: {
    CookieDisclaimer: true,
    VueAnnouncer: { template: '<div id="announcer" aria-live="polite"></div>' },
    nuxt: true,
    PageHeader: true,
    PageFooter: true
  }
});

describe('layouts/default.vue', () => {
  describe('VueAnnouncer', () => {
    it('is enabled', () => {
      const wrapper = factory();
      wrapper.find('#announcer').exists().should.equal(true);
    });
  });
});
