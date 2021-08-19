import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import CompareImageSlider from '@/components/generic/CompareImageSlider.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (setImageWidthSpy) => shallowMount(CompareImageSlider, {
  localVue,
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
    rightImageHeight: 596
  },
  methods: { setImageWidth: setImageWidthSpy || sinon.spy() },
  mocks: {
    $t: (key) => key
  }
});

describe('components/generic/CompareImageSlider', () => {
  it('has left image', () => {
    const wrapper = factory();

    const leftImage = wrapper.find('[data-qa="compare image left image"]');
    leftImage.attributes().src.should.contain('/img/portrait.jpg');
  });

  it('has right image', () => {
    const wrapper = factory();

    const rightImage = wrapper.find('[data-qa="compare image right image"]');
    rightImage.attributes().src.should.contain('/img/portrait-monochrome.jpg');
  });

  it('cites left image attribution', () => {
    const wrapper = factory();

    const leftCite = wrapper.find('figcaption [data-qa="compare image left attribution"]');
    leftCite.should.exist;
  });

  it('cites right image attribution', () => {
    const wrapper = factory();

    const rightCite = wrapper.find('figcaption [data-qa="compare image right attribution"]');
    rightCite.should.exist;
  });

  it('generates the correct clip sizing', async() => {
    const wrapper = factory();
    await wrapper.setData({
      imageWidth: 620,
      sliderPosition: 0.5
    });

    wrapper.vm.leftImageClip.clip.should.eq('rect(auto, 310px, auto, auto)');
  });

  it('places the slider bar in the correct position', async() => {
    const wrapper = factory();
    await wrapper.setData({
      imageWidth: 620,
      sliderPosition: 0.5,
      sliderWidth: 20
    });

    wrapper.vm.sliderBarPosition.left.should.eq('300px');
  });

  it('sets dragging property to `true` when the user clicks on the slider', async() => {
    const wrapper = factory();
    const slider = wrapper.find('[data-qa="compare image slider"]');

    slider.trigger('mousedown');

    wrapper.vm.dragging.should.eq(true);
  });

  it('sets dragging property to `false` when the user clicks off the slider', async() => {
    const wrapper = factory();
    const slider = wrapper.find('[data-qa="compare image slider"]');

    slider.trigger('mouseup');

    wrapper.vm.dragging.should.eq(false);
  });

  it('calls `setImageWidth` method when browser has been resized', () => {
    const setImageWidth = sinon.spy();
    factory(setImageWidth);

    global.window.dispatchEvent(new Event('resize'));

    setImageWidth.should.have.callCount(1);
  });
});
