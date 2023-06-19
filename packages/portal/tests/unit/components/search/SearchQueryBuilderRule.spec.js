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

  describe('rule validation', () => {
    describe('when none of the rule components have a value', () => {
      const wrapper = factory({ propsData: { value: {} } });
      wrapper.setProps({ validate: true });

      it('marks all as valid', () => {
        expect(wrapper.vm.validations).toEqual({
          field: { state: true },
          modifier: { state: true },
          term: { state: true }
        });
      });

      it('emits `valid` event', () => {
        expect(wrapper.emitted('valid').length).toBe(1);
      });
    });

    describe('when all of the rule components have a value', () => {
      const wrapper = factory({ propsData: { value: { field: 'what', modifier: 'contains', term: 'fruit' } } });
      wrapper.setProps({ validate: true });

      it('marks all as valid', () => {
        expect(wrapper.vm.validations).toEqual({
          field: { state: true },
          modifier: { state: true },
          term: { state: true }
        });
      });

      it('emits `valid` event', () => {
        expect(wrapper.emitted('valid').length).toBe(1);
      });
    });

    describe('when only some of the rule components have a value', () => {
      const wrapper = factory({ propsData: { value: { field: 'what', term: 'fruit' } } });
      wrapper.setProps({ validate: true });

      it('marks those as valid, others as invalid with feedback', () => {
        expect(wrapper.vm.validations).toEqual({
          field: { state: true },
          modifier: { state: false, text: 'statuses.required' },
          term: { state: true }
        });
      });

      it('emits `invalid` event', () => {
        expect(wrapper.emitted('invalid').length).toBe(1);
      });
    });
  });
});
