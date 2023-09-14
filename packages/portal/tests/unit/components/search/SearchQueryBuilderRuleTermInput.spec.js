import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRuleTermInput from '@/components/search/SearchQueryBuilderRuleTermInput.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (data = {}) => shallowMount(SearchQueryBuilderRuleTermInput, {
  localVue,
  propsData: {},
  data() {
    return {
      term: this.value,
      showSearchOptions: false,
      selectedValue: null,
      submitting: null,
      ...data
    };
  },
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/SearchQueryBuilderRuleTermInput', () => {
  afterEach(sinon.resetHistory);

  describe('watch', () => {
    describe('value', () => {
      it('sets the term', async() => {
        const value = 'flower';
        const wrapper = factory();

        await wrapper.setProps({ value });

        expect(wrapper.vm.term).toEqual(value);
      });
    });

    describe('term', () => {
      describe('when no new value', () => {
        it('hides the search options', async() => {
          const wrapper = factory({ showSearchOptions: true });

          await wrapper.setData({ term: '' });

          expect(wrapper.vm.showSearchOptions).toEqual(false);
        });
      });
    });
  });

  describe('methods', () => {
    describe('handleChange', () => {
      it('emits the change event', () => {
        const wrapper = factory();

        wrapper.vm.handleChange();

        expect(wrapper.emitted('change').length).toBe(1);
      });
    });

    describe('handleSelect', () => {
      it('handles change', () => {
        const query = 'flower';
        const wrapper = factory();
        sinon.spy(wrapper.vm, 'handleSelect');
        sinon.spy(wrapper.vm, 'handleChange');

        wrapper.vm.handleSelect({ option: { query } });

        expect(wrapper.vm.handleChange.called).toBe(true);
      });
    });

    describe('handleFocusOutChange', () => {
      describe('when focus is moved outside the search dropdown', () => {
        it('handles change', () => {
          const wrapper = factory({ term: 'flower' });
          sinon.spy(wrapper.vm, 'handleChange');

          wrapper.vm.handleFocusOutChange({ event: { relatedTarget: { id: 'some-element-outside' } } });

          expect(wrapper.vm.handleChange.called).toBe(true);
        });
      });
    });
  });
});