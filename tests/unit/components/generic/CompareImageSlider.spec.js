import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import CompareImageSlider from '../../../../components/generic/CompareImageSlider.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (setImageWidthSpy) => shallowMount(CompareImageSlider, {
  localVue,
  propsData: {
    imageLeft: 'https://www.fillmurray.com/640/360',
    imageRight: 'https://www.placecage.com/640/360'
  },
  methods: { setImageWidth: setImageWidthSpy }
});

describe('components/generic/CompareImageSlider', () => {
  it('has left Image', () => {
    const wrapper = factory();

    const leftImage = wrapper.find('[data-qa="compare image left image"]');
    leftImage.attributes().src.should.contain('https://www.fillmurray.com/640/360');
  });

  it('has right image', () => {
    const wrapper = factory();

    const rightImage = wrapper.find('[data-qa="compare image right image"]');
    rightImage.attributes().src.should.contain('https://www.placecage.com/640/360');
  });

  it('if available, left image has alt text', () => {
    const wrapper = factory();
    wrapper.setProps({ imageLeftText: 'left image text' });

    const leftImage = wrapper.find('[data-qa="compare image left image"]');
    leftImage.attributes().alt.should.contain('left image text');
  });

  it('if available, right image has alt text', () => {
    const wrapper = factory();
    wrapper.setProps({ imageRightText: 'right image text' });

    const rightImage = wrapper.find('[data-qa="compare image right image"]');
    rightImage.attributes().alt.should.contain('right image text');
  });

  it('generates the correct clip sizing', () => {
    const wrapper = factory();
    wrapper.setData({
      imageWidth: 620,
      sliderPosition: 0.5
    });

    wrapper.vm.leftImageClip.clip.should.eq('rect(auto, 310px, auto, auto)');
  });

  it('places the slider bar in the correct position', () => {
    const wrapper = factory();
    wrapper.setData({
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

    setImageWidth.should.have.callCount(2);
  });
});
