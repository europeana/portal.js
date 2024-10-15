import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemMediaThumbnails from '@/components/item/ItemMediaThumbnails';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(ItemMediaThumbnails, {
  localVue,
  attachTo: document.body,
  propsData: {
    edmType: 'image',
    ...propsData
  },
  mocks: {
    $t: (key) => key,
    ...mocks
  }
});

describe('components/item/ItemMediaThumbnail', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    it('renders media thumbnails', () => {
      const wrapper = factory();

      const thumbnail = wrapper.find('.media-thumbnails');

      expect(thumbnail.isVisible()).toBe(true);
    });
  });

  describe('when the selected page is after the first page', () => {
    beforeAll(() => {
      sinon.stub(itemMediaPresentation, 'default').returns({
        page: 2,
        resources: [
          {},
          {}
        ]
      });
    });
    afterAll(() => {
      itemMediaPresentation.default.restore();
    });

    it('instant-scrolls the thumbnails bar to the active position', async() => {
      const wrapper = factory({ mocks: { page: 2 } });
      wrapper.vm.scrollElementToCentre = sinon.spy();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.scrollElementToCentre.calledWith(
        sinon.match.any,
        sinon.match.has('behavior', 'instant')
      )).toBe(true);
    });

    describe('when the media thumbnails element is not yet available', () => {
      it('does not scroll the thumbnails bar', () => {
        const wrapper = factory({ mocks: { page: 2 } });
        wrapper.vm.scrollElementToCentre = sinon.spy();
        wrapper.vm.$refs.mediaThumbnails = null;

        expect(wrapper.vm.scrollElementToCentre.called).toBe(false);
      });
    });
  });

  describe('on resize', () => {
    it('smooth-scrolls the thumbnails bar to the active position', () => {
      const wrapper = factory();
      wrapper.vm.scrollElementToCentre = sinon.spy();

      window.dispatchEvent(new Event('resize'));

      expect(wrapper.vm.scrollElementToCentre.calledWith(
        sinon.match.any,
        sinon.match.has('behavior', 'smooth')
      )).toBe(true);
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
