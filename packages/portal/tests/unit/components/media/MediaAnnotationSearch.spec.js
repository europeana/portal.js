import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import MediaAnnotationSearch from '@/components/media/MediaAnnotationSearch.vue';

const localVue = createLocalVue();
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
    $route: {
      query: { fulltext }
    },
    $router: {
      push: routerPushSpy
    },
    ...mocks
  },
  localVue,
  stubs: ['b-form', 'b-form-group', 'b-form-input', 'MediaAnnotationList']
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

    // FIXME: submit.prevent trigger isn't working here (but does when rendered)
    // it('updates the route when the form is submitted', async() => {
    //   const wrapper = factory({ data: { query } });
    //
    //   wrapper.find('#media-annotation-search-form').trigger('submit.prevent');
    //   await wrapper.vm.$nextTick();
    //
    //   expect(routerPushSpy.calledWith({ query: { query } })).toBe(true);
    // });
  });
});
