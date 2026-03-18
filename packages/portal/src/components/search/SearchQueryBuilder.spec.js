import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import SearchQueryBuilder from '@/components/search/SearchQueryBuilder.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const routerPushSpy = sinon.spy();

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
      push: routerPushSpy
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

        expect(routerPushSpy.calledWith({
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
          modifier: null,
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

        expect(routerPushSpy.called).toBe(false);
      });

      it('does not track the rules as events in Matomo', async() => {
        const wrapper = factory();
        await wrapper.setData({ queryRules });

        const form = wrapper.find('[data-qa="search query builder form"]');
        form.trigger('submit.prevent');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
      });
    });
  });

  describe('rule event handling', () => {
    describe('@change', () => {
      describe('when the new rule is valid', () => {
        const newVal = { field: 'proxy_dc_title', modifier: 'doesNotContain', term: 'europe' };

        it('submits the form', async() => {
          const wrapper = factory();
          await wrapper.setData({ queryRules: [
            { field: 'proxy_dc_title', modifier: 'contains', term: 'europe' }
          ] });

          const rule = wrapper.find('#search-query-builder-rule-0');
          await rule.vm.$emit('change', newVal);

          expect(routerPushSpy.called).toBe(true);
        });
      });

      describe('when the new rule is not valid', () => {
        const newVal = { field: 'proxy_dc_title', modifier: 'doesNotContain', term: null };

        it('does not submit the form', async() => {
          const wrapper = factory();
          await wrapper.setData({ queryRules: [
            { field: 'proxy_dc_title', modifier: 'contains', term: 'europe' }
          ] });

          const rule = wrapper.find('#search-query-builder-rule-0');
          await rule.vm.$emit('change', newVal);

          expect(routerPushSpy.called).toBe(false);
        });
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
  });
});
