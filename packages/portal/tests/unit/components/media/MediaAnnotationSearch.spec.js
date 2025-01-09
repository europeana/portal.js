import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import MediaAnnotationSearch from '@/components/media/MediaAnnotationSearch.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
const routerPushSpy = sinon.spy();
const fulltext = 'something';

const factory = ({ data, propsData, mocks } = {}) => shallowMount(MediaAnnotationSearch, {
  data() {
    return {
      ...data
    };
  },
  propsData,
  mocks: {
    $t: (key) => key,
    $route: {
      query: { fulltext }
    },
    $router: {
      push: routerPushSpy
    },
    ...mocks
  },
  localVue,
  stubs: ['MediaAnnotationList']
});

describe('components/media/MediaAnnotationSearch', () => {
  afterEach(sinon.resetBehavior);
  afterAll(sinon.restore);

  describe('template', () => {
    it('renders a form input for the query', () => {
      const wrapper = factory();

      const input = wrapper.find('#media-annotation-search-query');

      expect(input.isVisible()).toBe(true);
    });

    it('initialises the form input value from the route query', () => {
      const wrapper = factory();

      const input = wrapper.find('#media-annotation-search-query');

      expect(input.attributes('value')).toBe(fulltext);
    });

    it('renders MediaAnnotationList to run the search', () => {
      const wrapper = factory();

      const list = wrapper.find('MediaAnnotationList-stub');

      expect(list.isVisible()).toBe(true);
      expect(list.attributes('query')).toBe(fulltext);
    });

    it('shows "no results" message if no annotations when searching', () => {
      const propsData = { annoQuery: 'euro' };
      const wrapper = factory({ propsData });

      wrapper.vm.handleAnnotationsFetched(0);

      const text = wrapper.text();

      expect(text).toBe('noResults');
    });
  });

  describe('on form submit', () => {
    it('updates the route and resets the fetch state', async() => {
      const query = 'euro';
      const wrapper = factory({ data: { query } });

      wrapper.find('#media-annotation-search-form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(routerPushSpy.calledWith({ query: { fulltext: 'euro' } })).toBe(true);
      expect(wrapper.vm.annotationsFetched).toEqual(false);
    });

    it('hides the no results message while fetching new results', async() => {
      const wrapper = factory({ data: { annoQuery: 'euro' } });
      wrapper.vm.annotationsFetched = true;

      wrapper.find('#media-annotation-search-form').trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.annotationsFetched).toEqual(false);
      expect(wrapper.find('output.visually-hidden').exists()).toBe(true);
    });
  });
});
