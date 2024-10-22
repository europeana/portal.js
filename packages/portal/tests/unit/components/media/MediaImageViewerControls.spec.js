import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaImageViewerControls from '@/components/media/MediaImageViewerControls';
import useZoom from '@/composables/zoom.js';
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
  const {
    setCurrent,
    setDefault,
    setMin,
    setMax
  } = useZoom();
  setDefault(2);
  setMin(0);
  setMax(5);

  beforeEach(() => {
    // set to default zoom
    setCurrent(2);
  });

  describe('template', () => {
    it('renders a wrapper', () => {
      const wrapper = factory();

      const viewerWrapper = wrapper.find('#viewer-controls');

      expect(viewerWrapper.isVisible()).toBe(true);
    });

    it('has a fullscreen button', () => {
      const wrapper = factory();

      const fullscreenButton = wrapper.find('.icon-fullscreen');

      expect(fullscreenButton.isVisible()).toBe(true);
    });
  });

  describe('zoom in button', () => {
    it('has the zoom in icon', () => {
      const wrapper = factory();

      const zoomInButton = wrapper.find('.icon-zoom-in');

      expect(zoomInButton.isVisible()).toBe(true);
    });

    describe('at maximum zoom', () => {
      it('is disabled', () => {
        setCurrent(5);
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.zoomIn"]');

        expect(button.attributes('disabled')).toBe('true');
      });
    });

    describe('at default zoom', () => {
      it('is enabled', () => {
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.zoomIn"]');

        expect(button.attributes('disabled')).toBe(undefined);
      });
    });
  });

  describe('zoom out button', () => {
    it('has the zoom out icon', () => {
      const wrapper = factory();

      const zoomOutButton = wrapper.find('.icon-zoom-out');

      expect(zoomOutButton.isVisible()).toBe(true);
    });

    describe('at minimum zoom', () => {
      it('is disabled', () => {
        setCurrent(0);
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.zoomOut"]');

        expect(button.attributes('disabled')).toBe('true');
      });
    });

    describe('at default zoom', () => {
      it('is enabled', () => {
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.zoomOut"]');

        expect(button.attributes('disabled')).toBe(undefined);
      });
    });
  });

  describe('reset zoom button', () => {
    it('has the reset zoom icon', () => {
      const wrapper = factory();

      const resetZoomButton = wrapper.find('.icon-reset');

      expect(resetZoomButton.isVisible()).toBe(true);
    });

    describe('at default zoom', () => {
      it('is disabled', () => {
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.resetZoom"]');

        expect(button.attributes('disabled')).toBe('true');
      });
    });

    describe('at non default zoom', () => {
      it('is enabled', () => {
        setCurrent(3);
        const wrapper = factory();

        const button = wrapper.find('[aria-label="media.controls.resetZoom"]');

        expect(button.attributes('disabled')).toBe(undefined);
      });
    });
  });
});
