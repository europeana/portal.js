import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import CompareImageSlider from '../../../../components/generic/CompareImageSlider.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);


const factory = () => shallowMount(CompareImageSlider, {
  localVue,
  propsData: {
    imageLeft: 'https://www.fillmurray.com/640/360',
    imageRight: 'https://www.placecage.com/640/360'
  }
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

  it('calls `setImageWidth` method when browser has been resized', () => {
    factory();
    const setImageWidth = sinon.spy();
    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      setImageWidth.should.have.been.called;
    });

  });

  it('calls `initDrag` method when the user clicks on the slider', async() => {
    const wrapper = factory();
    const slider = wrapper.find('[data-qa="compare image slider"]');

    slider.trigger('mousedown');

    wrapper.vm.dragging.should.eq(true);
  });

  // it('has a title', () => {
  //   const wrapper = factory();
  //   wrapper.setProps({ headline: 'Welcome at Europeana' });

  //   const title = wrapper.find('[data-qa="hero banner"] h2');
  //   title.text().should.contain('Welcome at Europeana');
  // });

  // it('has a description', () => {
  //   const wrapper = factory();
  //   wrapper.setProps({ description: 'Explore artworks, artefacts, books, films and music' });

  //   const description = wrapper.find('[data-qa="hero banner"] .lead');
  //   description.text().should.contain('Explore artworks, artefacts, books, films and music');
  // });

  // it('has a link', () => {
  //   const wrapper = factory();
  //   wrapper.setProps({ identifier: '/15508/DG2014_46_12' });

  //   const link = wrapper.find('[data-qa="hero banner"] a');
  //   link.attributes().href.should.contain('15508/DG2014_46_12');
  // });

  // it('has an attribution', () => {
  //   const wrapper = factory();
  //   wrapper.setProps({ attribution: 'Johannes Vermeer' });

  //   const attribution = wrapper.find('[data-qa="hero banner"] a');
  //   attribution.text().should.contain('Johannes Vermeer');
  // });

  // it('has a rights statement', () => {
  //   const wrapper = factory();
  //   wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

  //   const rights = wrapper.find('[data-qa="hero banner"] a span');
  //   rights.text().should.contain('In Copyright');
  // });
});
