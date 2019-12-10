import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchResults from '../../../../components/search/SearchResults.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const factory = (options = {}) => {
  const store = new Vuex.Store({
    state: {
      search: {
        view: options.view
      }
    },
    getters: {
      'search/activeView': (state) => state.search.view
    }
  });

  return mount(SearchResults, {
    localVue,
    store,
    mocks: {
      localePath: (opts) => `/record/${opts.params.pathMatch}`,
      $i18n: {
        locale: 'en'
      },
      $t: () => {}
    }
  });
};

const results = [
  {
    europeanaId: '/123/abc',
    dcTitle: { def: ['Record 123/abc'] },
    edmPreview: 'https://www.example.org/abc.jpg',
    edmDataProvider: ['Provider 123']
  },
  {
    europeanaId: '/123/def',
    dcTitle: { def: ['Record 123/def'] },
    edmPreview: 'https://www.example.org/def.jpg',
    edmDataProvider: ['Provider 123']
  }
];

describe('components/search/SearchResults', () => {
  context('when view is grid', () => {
    const wrapper = factory({ view: 'grid' });

    it('renders each result with a link', () => {
      wrapper.setProps({ value: results });

      const renderedResults =  wrapper.findAll('[data-qa="search result"] a');

      renderedResults.at(0).attributes().href.should.endWith(`/record${results[0].europeanaId}`);
      renderedResults.at(1).attributes().href.should.endWith(`/record${results[1].europeanaId}`);
    });
  });

  context('when view is list', () => {
    const wrapper = factory({ view: 'list' });

    it('renders each result with a link', () => {
      wrapper.setProps({ value: results });

      const renderedResults =  wrapper.findAll('a[data-qa="search result"]');

      renderedResults.at(0).attributes().href.should.endWith(`/record${results[0].europeanaId}`);
      renderedResults.at(1).attributes().href.should.endWith(`/record${results[1].europeanaId}`);
    });
  });
});
