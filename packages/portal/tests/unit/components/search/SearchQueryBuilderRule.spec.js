import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRule from '@/components/search/SearchQueryBuilderRule.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMount(SearchQueryBuilderRule, {
  localVue,
  propsData,
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

  describe('clear button', () => {
    it('clears all values', () => {
      const propsData = {
        field: 'proxy_dc_title',
        modifier: 'contains',
        term: 'cat'
      };
      const wrapper = factory({ propsData });
      expect(wrapper.vm.inputTerm).toBe('cat');
      expect(wrapper.vm.selectField).toBe('proxy_dc_title');
      expect(wrapper.vm.selectModifier).toBe('contains');

      const clearButton = wrapper.find('[data-qa="search query builder rule clear button"]');
      clearButton.trigger('click');

      expect(wrapper.vm.inputTerm).toBeNull();
      expect(wrapper.vm.selectField).toBeNull();
      expect(wrapper.vm.selectModifier).toBeNull();
    });

    it('emits "clear" event', () => {
      const wrapper = factory();

      const clearButton = wrapper.find('[data-qa="search query builder rule clear button"]');
      clearButton.trigger('click');

      expect(wrapper.emitted('clear').length).toBe(1);
    });
  });
});
