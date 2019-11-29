import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchFilters from '../../../../components/search/SearchFilters.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchFilters, {
  localVue,
  mocks: {
    $t: (key, opts) => {
      return `${key}: ${JSON.stringify(opts)}`;
    },
    $tc: (key, opts) => {
      return `${key}: ${JSON.stringify(opts)}`;
    },
    $te: () => {
      return false;
    }
  }
});

describe('components/search/SearchFilters', () => {
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
    badge.text().should.eq('formatting.labelledValue: {"label":"facets.TYPE.name: 1","value":"IMAGE"}');
  });

  it('shows a customised badge when it displays content tier', () => {
    const wrapper = factory();
    wrapper.setProps({ facets: { contentTier: ['*'] } });

    const badge = wrapper.find('.badge');
    badge.text().should.eq('facets.contentTier.name: undefined');
  });
});
