import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import SearchQueryBuilder from '@/components/search/SearchQueryBuilder.vue';
import BootstrapVue from 'bootstrap-vue';

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
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/search/SearchQueryBuilder', () => {
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

  describe('methods', () => {
    describe('clearRule', () => {
      it('removes rule if there are others', async() => {
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

      it('leaves rule if there are no others', async() => {
        const wrapper = factory();

        await wrapper.setData({ queryRules: [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' }
        ] });

        wrapper.vm.clearRule(0);

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toEqual(
          { field: 'proxy_dc_title', modifier: 'contains', term: 'dog' }
        );
      });
    });
  });
});
