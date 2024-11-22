import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import { shallowMountNuxt } from '../../utils';
import MediaAnnotationList from '@/components/media/MediaAnnotationList.vue';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';
import * as scrollTo from '@/composables/scrollTo.js';

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
    $route: {
      query: {}
    },
    $router: {
      replace: routerReplaceSpy
    },
    ...mocks
  },
  localVue,
  stubs: ['NuxtLink', 'b-col', 'b-row', 'b-container']
});

const stubItemMediaPresentationComposable = (stubs = {}) => {
  sinon.stub(itemMediaPresentation, 'default').returns({
    annotations,
    fetchCanvasAnnotations: fetchCanvasAnnotationsSpy,
    pageForAnnotationTarget: () => 1,
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

      const listItems = wrapper.findAll('NuxtLink-stub');

      expect(listItems.at(0).text()).toBe('anno 1');
      expect(listItems.at(1).text()).toBe('anno 2');
    });

    it('marks active annotation', () => {
      stubItemMediaPresentationComposable({ activeAnnotation: { id: 'anno2' } });
      const wrapper = factory();

      const listItems = wrapper.findAll('[data-qa="annotation list item"');

      expect(listItems.at(1).classes('active')).toBe(true);
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

        expect(searchAnnotationsSpy.calledWith('something')).toBe(true);
      });
    });

    describe('when there is an annotation in the route query', () => {
      const $route = { query: { anno: 'anno2' } };

      it('calls setActiveAnnotation on itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory({ mocks: { $route } });

        await wrapper.vm.fetch();

        expect(setActiveAnnotationSpy.calledWith(annotations[1])).toBe(true);
      });

      it('instant-scrolls to the annotation via scrollTo composable', async() => {
        const scrollElementToCentreSpy = sinon.spy();
        sinon.stub(scrollTo, 'default').returns({
          scrollElementToCentre: scrollElementToCentreSpy
        });
        stubItemMediaPresentationComposable({ activeAnnotation: annotations[0] });
        process.client = true;
        const wrapper = factory({ mocks: { $route }, propsData: { active: true } });

        wrapper.vm.fetch();
        await new Promise(process.nextTick);

        expect(scrollElementToCentreSpy.calledWith(sinon.match.any, sinon.match.has('behavior', 'instant'))).toBe(true);
      });
    });
  });
});
