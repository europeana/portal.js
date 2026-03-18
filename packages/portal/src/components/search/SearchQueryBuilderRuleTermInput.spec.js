import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchQueryBuilderRuleTermInput from '@/components/search/SearchQueryBuilderRuleTermInput.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeCommitSpy = sinon.spy();

const factory = ({ data = {}, propsData = {} } = {}) => shallowMount(SearchQueryBuilderRuleTermInput, {
  localVue,
  propsData,
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
    $store: {
      commit: storeCommitSpy
    },
    $t: (key) => key
  }
});

describe('components/search/SearchQueryBuilderRuleTermInput', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    const qas = {
      control: 'advanced search query builder: term control',
      searchOptions: 'advanced search query builder: term search options'
    };

    describe('wrapper', () => {
      describe('on focusin event', () => {
        const event = 'focusin';

        it('makes the click outside handler active', async() => {
          const wrapper = factory();

          await wrapper.trigger(event);

          expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);
        });
      });
    });

    describe('control', () => {
      describe('on input event', () => {
        const event = 'input';

        it('hides search options if value is blank', async() => {
          const wrapper = factory();

          const control = wrapper.find(`[data-qa="${qas.control}"]`);
          await control.vm.$emit(event, '');

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          expect(searchOptions.isVisible()).toBe(false);
        });

        it('shows search options if value is not blank', async() => {
          const wrapper = factory();

          const control = wrapper.find(`[data-qa="${qas.control}"]`);
          await control.vm.$emit(event, 'doo');

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          expect(searchOptions.isVisible()).toBe(true);
        });

        it('emits input event', async() => {
          const wrapper = factory();

          const control = wrapper.find(`[data-qa="${qas.control}"]`);
          await control.vm.$emit(event, 'dee');

          expect(wrapper.emitted().input[0]).toEqual(['dee']);
        });
      });

      describe('on blur event', () => {
        const event = 'blur';

        describe('when search options are shown', () => {
          const data = { showSearchOptions: true };

          it('does not trigger change event', async() => {
            const wrapper = factory({ data });

            const control = wrapper.find(`[data-qa="${qas.control}"]`);
            await control.vm.$emit(event);

            expect(wrapper.emitted().change).toBeFalsy();
          });
        });

        describe('when search options are not shown', () => {
          const data = { showSearchOptions: false };

          it('triggers change event', async() => {
            const wrapper = factory({ data });

            const control = wrapper.find(`[data-qa="${qas.control}"]`);
            await control.vm.$emit(event);

            expect(wrapper.emitted().change).toBeTruthy();
          });
        });
      });
    });

    describe('search options', () => {
      const data = { showSearchOptions: true };

      describe('on input event', () => {
        const event = 'input';

        it('emits input event', async() => {
          const wrapper = factory({ data });
          const query = 'daa';

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          await searchOptions.vm.$emit(event, { query });

          expect(wrapper.emitted().input[0]).toEqual([query]);
        });

        it('triggers change event', async() => {
          const wrapper = factory({ data });
          const query = 'daa';

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          await searchOptions.vm.$emit(event, { query });

          expect(wrapper.emitted().change).toBeTruthy();
        });

        it('hides the search options', async() => {
          const wrapper = factory({ data });
          const query = 'daa';

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          await searchOptions.vm.$emit(event, { query });

          expect(searchOptions.isVisible()).toBe(false);
        });

        describe('when field needs entity lookup', () => {
          const field = 'proxy_dcterms_medium';
          const propsData = { advancedSearchField: field };

          it('commits selected option data to the store', async() => {
            const wrapper = factory({ data, propsData });

            const query = 'daa';
            const entityId = 'http://data.europeana.eu/concept/123';

            const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
            await searchOptions.vm.$emit(event, { query, entityId });

            expect(storeCommitSpy.calledWith('search/addQasWithSelectedEntityValue',
              { field, qa: query, id: entityId }
            )).toBe(true);
          });
        });

        describe('when field does not need entity lookup', () => {
          const field = 'what';
          const propsData = { advancedSearchField: field };

          it('does not commit selected option data to the store', async() => {
            const wrapper = factory({ data, propsData });

            const query = 'daa';
            const entityId = 'http://data.europeana.eu/concept/123';

            const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
            await searchOptions.vm.$emit(event, { query, entityId });

            expect(storeCommitSpy.called).toBe(false);
          });
        });
      });

      describe('on hide event', () => {
        const event = 'hide';

        it('emits change event', async() => {
          const wrapper = factory({ data });

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          await searchOptions.vm.$emit(event);

          expect(wrapper.emitted().change).toBeTruthy();
        });

        it('hides the search options', async() => {
          const wrapper = factory({ data });
          const query = 'daa';

          const searchOptions = wrapper.find(`[data-qa="${qas.searchOptions}"]`);
          await searchOptions.vm.$emit(event, { query });

          expect(searchOptions.isVisible()).toBe(false);
        });
      });
    });
  });

  describe('watch', () => {
    describe('value', () => {
      it('sets the term', async() => {
        const value = 'flower';
        const wrapper = factory();

        await wrapper.setProps({ value });

        expect(wrapper.vm.term).toEqual(value);
      });
    });
  });
});
