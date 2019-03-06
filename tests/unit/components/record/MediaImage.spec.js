import { shallowMount } from '@vue/test-utils';
import MediaImage from '../../../../components/record/MediaImage.vue';

const factory = () => shallowMount(MediaImage);

describe('components/record/MediaImage', () => {
  describe('when both src and link are present', () => {
    it('shows linked image', () => {
      const wrapper = factory();
      const props = { link: 'http://www.example.org/', src: 'http://www.example.org/image.jpg' };

      wrapper.setProps(props);

      const anchor = wrapper.find('a');
      anchor.attributes().href.should.eq(props.link);
      const image = anchor.find('img');
      image.attributes().src.should.eq(props.src);
    });
  });

  describe('when only src is present', () => {
    it('shows image without link', () => {
      const wrapper = factory();
      const props = { src: 'http://www.example.org/image.jpg' };

      wrapper.setProps(props);

      wrapper.contains('a').should.be.false;
      const image = wrapper.find('img');
      image.attributes().src.should.eq(props.src);
    });
  });

  describe('when neither src nor link are present', () => {
    it('does not show an image', () => {
      const wrapper = factory();

      wrapper.contains('a').should.be.false;
      wrapper.contains('img').should.be.false;
    });
  });
});
