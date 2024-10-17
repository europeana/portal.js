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
const fetchCanvasAnnotationsStub = sinon.stub();
const selectAnnotationStub = sinon.stub();
const routerPushSpy = sinon.spy();

const factory = ({ data, propsData, mocks } = {}) => shallowMountNuxt(MediaAnnotationList, {
  data() {
    return {
      ...data
    };
  },
  propsData,
  mocks: {
    $fetchState: {},
    $route: {
      query: {}
    },
    $router: {
      push: routerPushSpy
    },
    ...mocks
  },
  localVue,
  stubs: ['b-list-group', 'b-list-group-item']
});

const stubItemMediaPresentationComposable = (stubs = {}) => {
  sinon.stub(itemMediaPresentation, 'default').returns({
    annotations,
    fetchCanvasAnnotations: fetchCanvasAnnotationsStub,
    selectAnnotation: selectAnnotationStub,
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

    it('calls selectAnnotation on itemMediaPresentation composable when annotation is clicked', async() => {
      stubItemMediaPresentationComposable();
      const wrapper = factory();

      const listItem = wrapper.find('b-list-group-item-stub');
      await listItem.vm.$emit('click');

      expect(selectAnnotationStub.calledWith(annotations[0])).toBe(true);
    });
  });

  describe('fetch', () => {
    it('fetches annotation list via itemMediaPresentation composable', async() => {
      stubItemMediaPresentationComposable();
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(fetchCanvasAnnotationsStub.called).toBe(true);
    });
  });
});
