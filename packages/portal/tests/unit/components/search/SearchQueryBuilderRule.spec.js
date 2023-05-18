import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRule from '@/components/search/SearchQueryBuilderRule.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(SearchQueryBuilderRule, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/SearchQueryBuilderRule', () => {
  it('is rendered', () => {
    const wrapper = factory();

    const rule = wrapper.find('[data-qa="search query builder rule"]');

    expect(rule.exists()).toBe(true);
  });
});

