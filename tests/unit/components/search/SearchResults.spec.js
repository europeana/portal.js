import { createLocalVue, shallowMount } from '@vue/test-utils';
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

  return shallowMount(SearchResults, {
    localVue,
    store,
    mocks: {
      localePath: (opts) => `/record/${opts.params.pathMatch}`
    }
  });
};

describe('components/search/SearchResults', () => {
  context('when view is grid', () => {
    const wrapper = factory({ view: 'grid' });
    it('renders each result with a link', () => {
      const results = [
        {
          linkTo: '/record/123/abc',
          europeanaId: '/123/abc',
          fields: {
            dcTitle: [
              'Record 123/abc'
            ]
          }
        },
        {
          linkTo: '/record/123/def',
          europeanaId: '/123/def',
          fields: {
            dcTitle: [
              'Record 123/def'
            ]
          }
        }
      ];

      wrapper.setProps({ value: results });
      const renderedResults =  wrapper.findAll('[data-qa="search result"]');

      renderedResults.at(0).attributes().url.should.eq(results[0].linkTo);
      renderedResults.at(1).attributes().url.should.eq(results[1].linkTo);
    });
  });

  context('when view is list', () => {
    const wrapper = factory({ view: 'list' });

    it('renders each result with a link', () => {
      const results = [
        {
          linkTo: '/record/123/abc',
          europeanaId: '/123/abc'
        },
        {
          linkTo: '/record/123/def',
          europeanaId: '/123/def'
        }
      ];

      wrapper.setProps({ value: results });
      const renderedResults =  wrapper.findAll('[data-qa="search result"]');

      renderedResults.at(0).attributes().to.should.eq(results[0].linkTo);
      renderedResults.at(1).attributes().to.should.eq(results[1].linkTo);
    });
  });
});
