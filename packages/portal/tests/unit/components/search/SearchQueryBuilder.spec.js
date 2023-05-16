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
  describe('when there is a URL query present', () => {
    it('shows the advanced search functionality', () => {
      const wrapper = factory({ mocks: { $route: { query: { query: 'dog' } } } });

      expect(wrapper.emitted('show')).toEqual([[true]]);
    });
  });

  describe('when the URL query changes', () => {
    describe('and it is empty or has a falsy value', () => {
      it('hides the advanced search functionality', async() => {
        const wrapper = factory({ mocks: { $route: { query: { query: 'dog' } } } });

        wrapper.vm.$route.query.query = '';
        await wrapper.vm.$nextTick();

        // first sets it to true on mounted then to false on query change
        expect(wrapper.emitted('show')).toEqual([[true], [false]]);
      });
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

  describe('clear rule button', () => {
    describe('when there is only one rule', () => {
      it('is disabled', () => {
        const wrapper = factory();

        const clearButton = wrapper.find('[data-qa="clear rule button 0"]');
        clearButton.trigger('click');

        expect(clearButton.attributes('disabled')).toBe('true');
      });
    });
    describe('when there are multiple rules', () => {
      it('removes the rule for that index', () => {
        const wrapper = factory();
        wrapper.vm.queryRules = [{ index: 0 }, { index: 1 }];

        const firstClearButton = wrapper.find('[data-qa="clear rule button 0"]');

        firstClearButton.trigger('click');

        expect(wrapper.vm.queryRules.length).toBe(1);
        expect(wrapper.vm.queryRules[0]).toStrictEqual({ index: 1 });
      });
    });
  });
});

