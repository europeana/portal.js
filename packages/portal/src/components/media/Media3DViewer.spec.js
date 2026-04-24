import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';

import Media3DViewer from '@/components/media/Media3DViewer.vue';

const localVue = createLocalVue();

const factory = () => shallowMountNuxt(Media3DViewer, {
  localVue,
  propsData: {
    url: 'https://www.example.eu/model.glb'
  },
  stubs: ['b-button', 'model-viewer']
});

describe('components/media/Media3DViewer', () => {
  it('adds the model-viewer script to the head', () => {
    const wrapper = factory();

    expect(wrapper.vm.head().script[0].src.includes('model-viewer')).toBe(true);
  });

  describe('before the user interacts with the viewer', () => {
    it('only renders a play button', () => {
      const wrapper = factory();

      expect(wrapper.find('.play-button').exists()).toBe(true);
      expect(wrapper.find('model-viewer-stub').exists()).toBe(false);
    });
  });

  describe('when the user has interacted with the viewer', () => {
    it('renders the model viewer', async() => {
      const wrapper = factory();

      wrapper.vm.handleInteraction();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('model-viewer-stub').exists()).toBe(true);
      expect(wrapper.find('.play-button').exists()).toBe(false);
    });
  });

  describe('while media is loading', () => {
    it('renders a loading spinner', async() => {
      const wrapper = factory();

      wrapper.vm.interacted = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('loadingspinner-stub').exists()).toBe(true);
    });
  });

  describe('when media is loaded', () => {
    it('does NOT render a loading spinner', async() => {
      const wrapper = factory();

      wrapper.vm.interacted = true;
      wrapper.vm.handleLoad();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('loadingspinner-stub').exists()).toBe(false);
    });
  });

  describe('when the url prop is changed', () => {
    it('resets loaded and interacted data props', async() => {
      const wrapper = factory();

      wrapper.vm.interacted = true;
      wrapper.vm.loaded = true;

      await wrapper.setProps({ url: 'https://www.example.eu/model2.glb' });

      expect(wrapper.vm.interacted).toEqual(false);
      expect(wrapper.vm.loaded).toEqual(false);
    });
  });
});
