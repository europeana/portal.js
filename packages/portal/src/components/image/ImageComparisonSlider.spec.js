import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import ImageComparisonSlider from '@/components/image/ImageComparisonSlider.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(ImageComparisonSlider, {
  localVue,
  attachTo: document.body,
  propsData: {
    leftImageSrc: '/img/portrait.jpg',
    leftImageAttribution: {
      rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
    },
    leftImageWidth: 400,
    leftImageHeight: 596,
    rightImageSrc: '/img/portrait-monochrome.jpg',
    rightImageAttribution: {
      rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
    },
    rightImageWidth: 400,
    rightImageHeight: 596,
    lazy: false,
    ...propsData
  },
  mocks: {
    $t: (key) => key
  }
});

describe('components/image/ImageComparisonSlider', () => {
  it('has left image', () => {
    const wrapper = factory();

    const leftImage = wrapper.find('[data-qa="compare image left image"]');
    expect(leftImage.attributes().src).toContain('/img/portrait.jpg');
  });

  it('has right image', () => {
    const wrapper = factory();

    const rightImage = wrapper.find('[data-qa="compare image right image"]');
    expect(rightImage.attributes().src).toContain('/img/portrait-monochrome.jpg');
  });

  it('cites left image attribution', () => {
    const wrapper = factory();

    const leftCite = wrapper.find('figcaption [data-qa="compare image left attribution"]');
    expect(leftCite).toBeDefined();
  });

  it('cites right image attribution', () => {
    const wrapper = factory();

    const rightCite = wrapper.find('figcaption [data-qa="compare image right attribution"]');
    expect(rightCite).toBeDefined();
  });

  it('generates the correct clip sizing', async() => {
    const wrapper = factory();
    await wrapper.setData({
      imageWidth: 620,
      sliderPosition: 0.5
    });

    expect(wrapper.vm.leftImageClip.clip).toBe('rect(auto, 310px, auto, auto)');
  });

  it('places the slider bar in the correct position', async() => {
    const wrapper = factory();
    await wrapper.setData({
      imageWidth: 620,
      sliderPosition: 0.5,
      sliderWidth: 20
    });

    expect(wrapper.vm.sliderBarPosition.left).toBe('300px');
  });

  describe('dragging the slider', () => {
    it('sets dragging property to `true` when the user mouses down on the slider', () => {
      const wrapper = factory();
      const slider = wrapper.find('[data-qa="compare image slider"]');

      slider.trigger('mousedown');

      expect(wrapper.vm.dragging).toBe(true);
    });

    it('calls `drag` when dragging mouse', () => {
      const wrapper = factory();
      wrapper.setData({ dragging: true });
      sinon.spy(wrapper.vm, 'drag');

      const slider = wrapper.find('[data-qa="compare image slider"]');
      slider.trigger('mousemove');

      expect(wrapper.vm.drag.calledOnce).toBe(true);
    });

    it('sets dragging property to `false` when the user mouses up off the slider', () => {
      const wrapper = factory();
      const slider = wrapper.find('[data-qa="compare image slider"]');

      slider.trigger('mouseup');

      expect(wrapper.vm.dragging).toBe(false);
    });
  });

  it('calls `setImageWidth` method when browser has been resized', () => {
    const wrapper = factory();
    sinon.spy(wrapper.vm, 'setImageWidth');

    window.dispatchEvent(new Event('resize'));

    expect(wrapper.vm.setImageWidth.calledOnce).toBe(true);
  });
});
