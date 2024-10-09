import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaThumbnails from '@/components/item/ItemMediaThumbnails';
import sinon from 'sinon';

const localVue = createLocalVue();

const props = {
  edmType: 'image',
  selectedIndex: 0,
  resources: [
    { edmType: '' },
    { edmType: '' },
    { edmType: '' },
    { edmType: '' },
    { edmType: '' }
  ]
};

const factory = (propsData = props) => shallowMount(ItemMediaThumbnails, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/item/ItemMediaThumbnail', () => {
  describe('template', () => {
    it('renders a item media thumbnail', () => {
      const wrapper = factory();
      wrapper.vm.$refs.mediaThumbnails.scroll = sinon.spy();

      const thumbnail = wrapper.find('.media-thumbnails');

      expect(thumbnail.isVisible()).toBe(true);
    });
  });

  describe('when the selected page is after the first page', () => {
    it('scrolls the thumbnails bar to the active position', async() => {
      const wrapper = factory({ ...props, selectedIndex: 2 });
      wrapper.vm.scrollElementToCentre = sinon.spy();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.scrollElementToCentre.called).toBe(true);
    });

    describe('when the media thumbnails element is not yet available', () => {
      it('does not scroll the thumbnails bar', () => {
        const wrapper = factory({ ...props, selectedIndex: 2 });
        wrapper.vm.scrollElementToCentre = sinon.spy();
        wrapper.vm.$refs.mediaThumbnails = null;

        expect(wrapper.vm.scrollElementToCentre.called).toBe(false);
      });
    });
  });

  describe('on resize', () => {
    it('scrolls the thumbnails bar to the active position', () => {
      const wrapper = factory();
      wrapper.vm.scrollElementToCentre = sinon.spy();

      window.dispatchEvent(new Event('resize'));

      expect(wrapper.vm.scrollElementToCentre.called).toBe(true);
    });
  });

  describe('on destroy', () => {
    it('should remove resize event listener', () => {
      const wrapper = factory();

      const removeEventListener = sinon.spy(window, 'removeEventListener');

      wrapper.destroy();

      expect(removeEventListener.called).toBe(true);
    });
  });
});
