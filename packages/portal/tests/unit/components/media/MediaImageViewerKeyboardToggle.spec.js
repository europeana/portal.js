import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaImageViewerKeyboardToggle from '@/components/media/MediaImageViewerKeyboardToggle';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();

localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(MediaImageViewerKeyboardToggle, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/media/MediaImageViewerKeyboardToggle', () => {
  describe('keyboard toggle button', () => {
    it('renders a visually hidden button', () => {
      const wrapper = factory();

      const keyboardToggleButton = wrapper.find('[data-qa="media image viewer keyboard toggle button"].visually-hidden');

      expect(keyboardToggleButton.exists()).toBe(true);
    });

    describe('on focus', () => {
      it('shows a toast message', () => {
        const wrapper = factory();
        const showToast = sinon.spy(wrapper.vm.$bvToast, 'show');

        const keyboardToggleButton = wrapper.find('[data-qa="media image viewer keyboard toggle button"]');

        keyboardToggleButton.element.dispatchEvent(new Event('focus'));

        expect(showToast.calledWith('media-image-viewer-toast')).toBe(true);
      });
      describe('and keydown on a key that triggers a zoom or pan', () => {
        it('emits to render full image media', () => {
          const wrapper = factory();

          const keyboardToggleButton = wrapper.find('[data-qa="media image viewer keyboard toggle button"]');

          keyboardToggleButton.element.dispatchEvent(new Event('focus'));
          wrapper.vm.$refs.keyboardtoggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

          expect(wrapper.emitted('renderFullImage').length).toBe(1);
        });
      });
    });
  });

  describe('on escape key', () => {
    it('hides the toast message', async() => {
      const wrapper = factory();
      const hideToast = sinon.spy(wrapper.vm.$bvToast, 'hide');

      const keyboardToggle = wrapper.find('[data-qa="media image viewer keyboard toggle"]');

      await keyboardToggle.trigger('keyup.escape');

      expect(hideToast.calledWith('media-image-viewer-toast')).toBe(true);
    });
  });
});

