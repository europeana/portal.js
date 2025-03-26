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

    it('emits input and change events when a button is clicked', () => {
      const wrapper = factory({ propsData });

      const optionButton = wrapper.find('[data-qa="advanced search query builder: what field option"]');
      optionButton.vm.$emit('click');

      expect(wrapper.emitted('input')).toEqual([['what']]);
      expect(wrapper.emitted('change')).toEqual([['what']]);
    });
  });

  describe('watch', () => {
    describe('flattenedOptions', () => {
      describe('when new options do not contain the current model value', () => {
        const propsData = {
          name: 'modifier',
          options: [{
            options: [
              { value: 'exact' },
              { value: 'contains' }
            ]
          }],
          value: 'exact'
        };
        const newOptions = [{
          options: [
            { value: 'contains' }
          ]
        }];

        it('emits input and change events to reset the model value', async() => {
          const wrapper = factory({ propsData });

          await wrapper.setProps({
            options: newOptions
          });

          expect(wrapper.emitted().input).toEqual([[null]]);
          expect(wrapper.emitted().change).toEqual([[null]]);
        });
      });
    });
  });
});
