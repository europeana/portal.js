import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import SearchQueryBuilder from '@/components/search/SearchQueryBuilder.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, data = {}, mocks = {} } = {}) => shallowMountNuxt(SearchQueryBuilder, {
  localVue,
  propsData,
  data() {
    return {
      ...data
    };
  },
  mocks: {
    $matomo: {
      trackEvent: sinon.spy()
    },
    $route: {
      query: {}
    },
    $router: {
      push: sinon.spy()
    },
    $store: {
      commit: sinon.spy()
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/search/SearchQueryBuilder', () => {
  afterEach(sinon.resetHistory);

  describe('when there is an advanced search in the route query', () => {
    const $route = { query: { qa: 'proxy_dc_title:dog' } };

    it('initalises with those rules', () => {
      const wrapper = factory({ mocks: { $route } });

      const queryRules = wrapper.vm.queryRules;

      expect(queryRules).toEqual([
        { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' }
      ]);
    });

    it('emits the "show" event', () => {
      const wrapper = factory({ mocks: { $route } });

      expect(wrapper.emitted('show')).toEqual([[true]]);
    });
  });

  describe('when there are no initial rules', () => {
    const $route = { query: {} };

    it('has one blank rule', () => {
      const wrapper = factory({ mocks: { $route } });

      const queryRules = wrapper.vm.queryRules;

      expect(queryRules).toEqual([{ field: null, modifier: null, term: null }]);
    });

    it('does not emit the "show" event', () => {
      const wrapper = factory({ mocks: { $route } });

      expect(wrapper.emitted('show')).toBeUndefined();
    });
  });

  describe('add new rule button', () => {
    it('adds a new search query builder rule', () => {
      const wrapper = factory();

      const addButton = wrapper.find('[data-qa="advanced search query builder: add rule button"]');
      addButton.trigger('click');

      expect(wrapper.vm.queryRules.length).toBe(2);
    });
  });

  describe('form submission', () => {
    describe('when all rules are valid', () => {
      const queryRules = [
        {
          field: 'proxy_dc_description',
          modifier: 'contains',
          term: 'flute'
        },
        {
          field: 'proxy_dc_title',
          modifier: 'doesNotContain',
          term: 'pigeon'
        }
      ];

      it('stores that the interaction is loggable', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
      });

      it('updates the router', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$router.push.calledWith({
          query: {
            page: 1,
            qa: ['proxy_dc_description:flute', '-proxy_dc_title:pigeon']
          }
        })).toBe(true);
      });

      it('tracks the rules as events in Matomo', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$matomo.trackEvent.getCalls().length).toBe(2);
        expect(wrapper.vm.$matomo.trackEvent.calledWith(
          'Adv search',
          'Apply adv search',
          'Adv search: fieldLabels.default.dcDescription search.advanced.modifiers.contains'
        )).toBe(true);
        expect(wrapper.vm.$matomo.trackEvent.calledWith(
          'Adv search',
          'Apply adv search',
          'Adv search: fieldLabels.default.dcTitle search.advanced.modifiers.doesNotContain'
        )).toBe(true);
      });
    });

    describe('when some rules are not valid', () => {
      const queryRules = [
        {
          field: 'proxy_dc_description',
          term: 'flute'
        },
        {
          field: 'proxy_dc_title',
          modifier: 'doesNotContain',
          term: 'pigeon'
        }
      ];

      it('does not update the router', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$router.push.called).toBe(false);
      });

      it('does not track the rules as events in Matomo', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        console.log('wrapper.vm.$matomo.trackEvent', wrapper.vm.$matomo.trackEvent.getCalls()[0].args)
        expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
      });
    });
  });

  describe('rule event handling', () => {
    describe('@change', () => {
      it('updates the relevant field of the rule', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'europe' }
        ] });

        const rule = wrapper.find('#search-query-builder-rule-0');
        rule.vm.$emit('change', 'modifier', 'doesNotContain');

        expect(wrapper.vm.queryRules[0]).toEqual(
          { field: 'proxy_dc_title', modifier: 'doesNotContain', term: 'europe' }
        );
      });
    });

    describe('@clear', () => {
      it('removes the relevant rule', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' },
          { field: 'proxy_dc_type', modifier: 'doesNotContain', term: 'photograph' }
        ] });

        const rule = wrapper.find('#search-query-builder-rule-0');
        rule.vm.$emit('clear');

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual(
          { field: 'proxy_dc_type', modifier: 'doesNotContain', term: 'photograph' }
        );
      });

      it('adds a blank rule if all are gone', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' }
        ] });

        const rule = wrapper.find('#search-query-builder-rule-0');
        rule.vm.$emit('clear');

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual({ field: null, modifier: null, term: null });
      });
    });

    describe('handleChangeRule', () => {
      it('sets the changed values for the query rules', async() => {
        const wrapper = factory();

        wrapper.vm.handleChangeRule(0, 'field', 'proxy_dc_description');

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual(
          { field: 'proxy_dc_description', modifier: null, term: null }
        );
      });

      describe('when the respective rule is valid', () => {
        it('automatically updates the search', async() => {
          const wrapper = factory();
          sinon.spy(wrapper.vm, 'handleSubmitForm');

          await wrapper.setData({ queryRules: [
            { field: 'proxy_dc_title', modifier: 'contains' }
          ] });

          wrapper.vm.handleChangeRule(0, 'term', 'dog');

          expect(wrapper.vm.handleSubmitForm.called).toBe(true);
        });
      });
    });
  });

  // describe('rule validation', () => {
  //   describe('when none of the rule components have a value', () => {
  //     const wrapper = factory({ propsData: { value: {} } });
  //     wrapper.setProps({ validate: true });
  //
  //     it('marks all as valid', () => {
  //       expect(wrapper.vm.validations).toEqual({
  //         field: { state: true },
  //         modifier: { state: true },
  //         term: { state: true }
  //       });
  //     });
  //
  //     it('emits `valid` event', () => {
  //       expect(wrapper.emitted('valid').length).toBe(1);
  //     });
  //   });
  //
  //   describe('when all of the rule components have a value', () => {
  //     const wrapper = factory({ propsData: { value: { field: 'what', modifier: 'contains', term: 'fruit' } } });
  //     wrapper.setProps({ validate: true });
  //
  //     it('marks all as valid', () => {
  //       expect(wrapper.vm.validations).toEqual({
  //         field: { state: true },
  //         modifier: { state: true },
  //         term: { state: true }
  //       });
  //     });
  //
  //     it('emits `valid` event', () => {
  //       expect(wrapper.emitted('valid').length).toBe(1);
  //     });
  //   });
  //
  //   describe('when only some of the rule components have a value', () => {
  //     const wrapper = factory({ propsData: { value: { field: 'what', term: 'fruit' } } });
  //     wrapper.setProps({ validate: true });
  //
  //     it('marks those as valid, others as invalid with feedback', () => {
  //       expect(wrapper.vm.validations).toEqual({
  //         field: { state: true },
  //         modifier: { state: false, text: 'statuses.required' },
  //         term: { state: true }
  //       });
  //     });
  //
  //     it('emits `invalid` event', () => {
  //       expect(wrapper.emitted('invalid').length).toBe(1);
  //     });
  //   });
  // });
});
