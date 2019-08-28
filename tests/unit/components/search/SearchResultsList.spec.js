import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchResultsList from '../../../../components/search/SearchResultsList.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(SearchResultsList, {
  localVue,
  mocks: {
    localePath: (opts) => `/record/${opts.params.pathMatch}`
  }
});

describe('components/search/SearchResultsList', () => {
  it('renders each result with a link', () => {
    const wrapper = factory();
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

    wrapper.setProps({ results });
    const renderedResults =  wrapper.findAll('[data-qa="search result"]');

    renderedResults.at(0).attributes().to.should.eq(results[0].linkTo);
    renderedResults.at(1).attributes().to.should.eq(results[1].linkTo);
  });
});
