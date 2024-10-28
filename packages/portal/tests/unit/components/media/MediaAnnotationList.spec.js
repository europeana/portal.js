import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import { shallowMountNuxt } from '../../utils';
import MediaAnnotationList from '@/components/media/MediaAnnotationList.vue';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';

const localVue = createLocalVue();

const annotations = [
  { body: { value: 'anno 1' }, id: 'anno1' },
  { body: { value: 'anno 2' }, id: 'anno2' }
];
const fetchCanvasAnnotationsSpy = sinon.spy();
const searchAnnotationsSpy = sinon.spy();
const setActiveAnnotationSpy = sinon.spy();
const routerReplaceSpy = sinon.spy();

const factory = ({ data, propsData, mocks } = {}) => shallowMountNuxt(MediaAnnotationList, {
  data() {
    return {
      ...data
    };
  },
  propsData,
  provide: {
    annotationScrollToContainerSelector: '#list-container'
  },
  mocks: {
    $fetchState: {},
    $route: {
      query: {}
    },
    $router: {
      replace: routerReplaceSpy
    },
    ...mocks
  },
  localVue,
  stubs: ['b-list-group', 'b-list-group-item']
});

const stubItemMediaPresentationComposable = (stubs = {}) => {
  sinon.stub(itemMediaPresentation, 'default').returns({
    annotations,
    fetchCanvasAnnotations: fetchCanvasAnnotationsSpy,
    searchAnnotations: searchAnnotationsSpy,
    setActiveAnnotation: setActiveAnnotationSpy,
    ...stubs
  });
};

describe('components/media/MediaAnnotationList', () => {
  afterEach(sinon.restore);

  describe('template', () => {
    it('renders annotations', () => {
      stubItemMediaPresentationComposable();
      const wrapper = factory();

      const listItems = wrapper.findAll('b-list-group-item-stub');

      expect(listItems.at(0).text()).toBe('anno 1');
      expect(listItems.at(1).text()).toBe('anno 2');
    });

    it('marks active annotation', () => {
      stubItemMediaPresentationComposable({ activeAnnotation: { id: 'anno2' } });
      const wrapper = factory();

      const listItems = wrapper.findAll('b-list-group-item-stub');

      expect(listItems.at(1).attributes('active')).toBe('true');
    });

    describe('when annotation is clicked', () => {
      it('calls setActiveAnnotation on itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory();

        const listItem = wrapper.find('b-list-group-item-stub');
        await listItem.vm.$emit('click');

        expect(setActiveAnnotationSpy.calledWith(annotations[0])).toBe(true);
      });

      it('replaces route', async() => {
        stubItemMediaPresentationComposable({
          activeAnnotation: { id: 'anno2' },
          pageForAnnotationTarget: () => 2
        });
        const wrapper = factory();

        const listItem = wrapper.find('b-list-group-item-stub');
        await listItem.vm.$emit('click');

        expect(routerReplaceSpy.calledWith({ query: { anno: 'anno2', page: 2 } })).toBe(true);
      });
    });
  });

  describe('fetch', () => {
    describe('without a query', () => {
      it('fetches canvas annotations via itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(fetchCanvasAnnotationsSpy.called).toBe(true);
      });
    });

    describe('with a query', () => {
      it('searches for annotations via itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const query = 'something';
        const wrapper = factory({ propsData: { query } });

        await wrapper.vm.fetch();

        expect(searchAnnotationsSpy.calledWith('"something"')).toBe(true);
      });
    });

    describe('when there is an annotation in the route query', () => {
      it('calls setActiveAnnotation on itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const $route = { query: { anno: 'anno1' } };
        const wrapper = factory({ mocks: { $route } });

        await wrapper.vm.fetch();

        expect(setActiveAnnotationSpy.calledWith(annotations[0])).toBe(true);
      });
    });
  });
});
