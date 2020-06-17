import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '../../../components/PageHeader.vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: () => {},
    $path: (code) => window.location.href + code
  },
  store: options.store || store({ ui: {} })
});

const getters = {
  'ui/searchView': (state) => state.ui.showSearch
};
const store = (uiState = {}) => {
  return new Vuex.Store({
    getters,
    state: {
      ui: uiState
    }
  });
};

describe('components/PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory({
      store: store({
        showSearch: true
      })
    });
    const form = wrapper.find('[data-qa="search form"]');
    form.isVisible().should.equal(true);
  });

  it('contains the logo', () => {
    const wrapper = factory({
      store: store({
        showSearch: false
      })
    });

    const logo = wrapper.find('[data-qa="logo"]');
    logo.attributes().src.should.match(/\/logo\..+\.svg$/);
  });
});
