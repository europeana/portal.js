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

      expect(queryRules).toEqual([{}]);
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
    it('validates the rules', async() => {
      const wrapper = factory();

      const form = wrapper.find('[data-qa="search query builder form"]');
      form.trigger('submit.prevent');

      expect(wrapper.vm.validatingRules).toBe(true);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.validatingRules).toBe(false);
    });

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
      const validations = [true, true];

      it('updates the router', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules, validations });

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
        await wrapper.setData({ queryRules, validations });

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
        const validations = [false, true];

        it('does not update the router', async() => {
          const wrapper = factory();
          await wrapper.setData({ queryRules, validations });

          const form = wrapper.find('[data-qa="search query builder form"]');
          form.trigger('submit.prevent');
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$router.push.called).toBe(false);
        });

        it('does not track the rules as events in Matomo', async() => {
          const wrapper = factory();
          await wrapper.setData({ queryRules, validations });

          const form = wrapper.find('[data-qa="search query builder form"]');
          form.trigger('submit.prevent');
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
        });
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
        expect(wrapper.vm.queryRules[0]).toEqual({});
      });
    });

    describe('@invalid', () => {
      it('marks the relevant rule as invalid', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title' }
        ] });

        const rule = wrapper.find('#search-query-builder-rule-0');
        rule.vm.$emit('invalid');

        expect(wrapper.vm.validations).toEqual([false]);
      });
    });

    describe('@valid', () => {
      it('marks the relevant rule as invalid', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' }
        ] });

        const rule = wrapper.find('#search-query-builder-rule-0');
        rule.vm.$emit('valid');

        expect(wrapper.vm.validations).toEqual([true]);
      });
    });
  });
});
