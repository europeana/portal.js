import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaImageViewerControls from '@/components/media/MediaImageViewerControls';
// import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMount(MediaImageViewerControls, {
  localVue,
  propsData,
  directives: { 'b-tooltip': () => {} },
  mocks: {
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-button']
});

describe('components/media/MediaImageViewerControls', () => {
  describe('template', () => {
    it('renders a wrapper', () => {
      const wrapper = factory();

      const viewerWrapper = wrapper.find('#viewer-controls');

      expect(viewerWrapper.isVisible()).toBe(true);
    });
  });
});
