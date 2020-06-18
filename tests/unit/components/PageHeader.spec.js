import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '../../../components/PageHeader.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

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
      ui: uiState,
      'link-group': {
        data: {
          mainNavigation: {
            links: [
              {
                text: 'Collections',
                url: '/collections'
              }
            ]
          },
          mobileNavigation: {
            links: [
              {
                text: 'Our partners',
                url: '/about/our-partners'
              }
            ]
          }
        }
      }
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
