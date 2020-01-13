import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MediaImage from '../../../../components/record/MediaImage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(MediaImage, {
  mocks: {
    $t: (key) => key
  }
});

describe('components/record/MediaImage', () => {
  describe('when both src and link are present', () => {
    it('shows linked image', () => {
      const wrapper = factory();
      const props = { link: 'http://www.example.org/', src: 'http://www.example.org/image.jpg' };

      wrapper.setProps(props);

      wrapper.attributes().href.should.eq(props.link);
      const image = wrapper.find('b-img-lazy');
      image.attributes().src.should.eq(props.src);
    });

    it('shows a view image link', () => {
      const wrapper = factory();
      const props = { link: 'http://www.example.org/', src: 'http://www.example.org/image.jpg', mediaType: 'image' };

      wrapper.setProps(props);

      const viewLink = wrapper.find('p');
      viewLink.text().should.eq('record.view.image');
    });

    it('shows a view pdf link', () => {
      const wrapper = factory();
      const props = { link: 'http://www.example.org/', src: 'http://www.example.org/image.pdf', mediaType: 'pdf' };

      wrapper.setProps(props);

      const viewLink = wrapper.find('p');
      viewLink.text().should.eq('record.view.pdf');
    });
  });

  describe('when only src is present', () => {
    it('shows image without link', () => {
      const wrapper = factory();
      const props = { src: 'http://www.example.org/image.jpg' };

      wrapper.setProps(props);

      wrapper.contains('a').should.be.false;
      const image = wrapper.find('b-img-lazy');
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
