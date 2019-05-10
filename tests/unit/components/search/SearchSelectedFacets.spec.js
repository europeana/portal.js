import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchSelectedFacets from '../../../../components/search/SearchSelectedFacets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchSelectedFacets, {
  localVue,
  mocks: {
    $t: (key, opts) => {
      return `${key}: ${opts}`;
    }
  }
});

describe('components/search/SearchSelectedFacets', () => {
  it('shows a badge for each supplied facet', () => {
    const wrapper = factory();
    wrapper.setProps({ facets: { TYPE: ['IMAGE', 'VIDEO'] } });

    const badges = wrapper.findAll('.badge');
    badges.length.should.eq(2);
  });

  it('shows the translated facet name and field value', () => {
    const wrapper = factory();
    wrapper.setProps({ facets: { TYPE: ['IMAGE'] } });

    const badge = wrapper.find('.badge');
    badge.text().should.eq('formatting.labelledValue: [object Object]');
  });
});
