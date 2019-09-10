import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchResultsGrid from '../../../../components/search/SearchResultsGrid.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(SearchResultsGrid, {
  localVue,
  mocks: {
    localePath: (opts) => `/record/${opts.params.pathMatch}`
  }
});

describe('components/search/SearchResultsGrid', () => {
  it('renders each result with a link', () => {
    const wrapper = factory();
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
