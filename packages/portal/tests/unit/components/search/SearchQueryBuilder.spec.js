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

      const addButton = wrapper.find('[data-qa="add rule button"]');
      addButton.trigger('click');

      expect(wrapper.vm.queryRules.length).toBe(2);
    });
  });

  describe('form submission', () => {
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

    it('updates the router', async() => {
      const wrapper = factory();
      await wrapper.setData({ queryRules });

      const form = wrapper.find('[data-qa="search query builder form"]');
      form.trigger('submit.prevent');

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

  describe('methods', () => {
    describe('clearRule', () => {
      it('removes the relevant rule', async() => {
        const wrapper = factory();

        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' },
          { field: 'proxy_dc_type', modifier: 'doesNotContain', term: 'photograph' }
        ] });

        wrapper.vm.clearRule(0);

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

        wrapper.vm.clearRule(0);

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual({});
      });
    });

    describe('handleChangeRule', () => {
      it('sets the changed values for the query rules', async() => {
        const wrapper = factory();

        wrapper.vm.handleChangeRule('field', 'proxy_dc_description', 0);

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual(
          { field: 'proxy_dc_description' }
        );
      });

      describe('when the respective rule is valid', () => {
        it('automatically updates the search', async() => {
          const wrapper = factory();
          sinon.spy(wrapper.vm, 'updateSearch');

          await wrapper.setData({ queryRules: [
            { field: 'proxy_dc_title', modifier: 'contains' }
          ] });

          wrapper.vm.handleChangeRule('term', 'dog', 0);

          expect(wrapper.vm.updateSearch.called).toBe(true);
        });
      });
    });
  });
});
