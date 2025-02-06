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

  describe('ruleValueString', () => {
    describe('when field, modifier and term are present', () => {
      it('returns the correct string', () => {
        const wrapper = factory({
          propsData: {
            value: {
              field: 'title',
              modifier: 'contains',
              term: 'Art'
            }
          }
        });

        expect(wrapper.vm.ruleValuesString).toBe('fieldLabels.default.title search.advanced.modifiers.contains Art');
      });
    });
    describe('when field and modifier are missing', () => {
      it('computes ruleValuesString correctly with missing field and modifier', () => {
        const wrapper = factory({
          propsData: {
            value: {
              field: '',
              modifier: '',
              term: 'Painting'
            }
          }
        });

        expect(wrapper.vm.ruleValuesString).toBe('Painting');
      });
    });
    describe('when field, modifier and term are missing', () => {
      it('computes ruleValuesString correctly with missing values', () => {
        const wrapper = factory();

        expect(wrapper.vm.ruleValuesString).toBe('');
      });
    });
  });
});
