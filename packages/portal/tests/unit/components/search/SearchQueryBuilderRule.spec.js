import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRule from '@/components/search/SearchQueryBuilderRule.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMount(SearchQueryBuilderRule, {
  attachTo: document.body,
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $te: () => true
  }
});

describe('components/search/SearchQueryBuilderRule', () => {
  it('is rendered', () => {
    const wrapper = factory();

    const rule = wrapper.find('[data-qa="search query builder rule"]');

    expect(rule.exists()).toBe(true);
  });

  describe('clear button', () => {
    it('emits "clear" event', () => {
      const wrapper = factory();

      const clearButton = wrapper.find('[data-qa="search query builder rule clear button"]');
      clearButton.trigger('click');

      expect(wrapper.emitted('clear').length).toBe(1);
    });
  });
});
