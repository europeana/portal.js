import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRuleDropdown from '@/components/search/SearchQueryBuilderRuleDropdown.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMount(SearchQueryBuilderRuleDropdown, {
  attachTo: document.body,
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $te: () => true
  }
});

describe('components/search/SearchQueryBuilderRuleDropdown', () => {
  const propsData = {
    name: 'field',
    options: [
      { options: [{ text: 'Full-text', value: 'fulltext' }] },
      { header: 'Aggregated fields', options: [
        { text: 'What', value: 'what' },
        { text: 'Who', value: 'who' }
      ] }
    ]
  };

  describe('template', () => {
    it('renders the options', () => {
      const wrapper = factory({ propsData });

      expect(wrapper.find('[data-qa="advanced search query builder: fulltext field option"]').exists()).toBe(true);
      expect(wrapper.find('[data-qa="advanced search query builder: what field option"]').exists()).toBe(true);
      expect(wrapper.find('[data-qa="advanced search query builder: who field option"]').exists()).toBe(true);
    });

    it('emits "change" event when a button is clicked', () => {
      const wrapper = factory({ propsData });

      const optionButton = wrapper.find('[data-qa="advanced search query builder: what field option"]');
      optionButton.vm.$emit('click');

      expect(wrapper.emitted('change').length).toBe(1);
      expect(wrapper.emitted('change')[0]).toEqual(['what']);
    });
  });
});
