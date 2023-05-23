import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import SearchQueryBuilder from '@/components/search/SearchQueryBuilder.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(SearchQueryBuilder, {
  localVue,
  propsData,
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
    it('emits the "show" event', () => {
      const wrapper = factory({ mocks: { $route: { query: { qa: 'proxy_dc_title:dog' } } } });

      expect(wrapper.emitted('show')).toEqual([[true]]);
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
});
