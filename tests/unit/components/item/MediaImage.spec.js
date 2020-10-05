import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MediaImage from '../../../../components/item/MediaImage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = { media: { ebucoreHasMimeType: 'image/jpeg', about: 'http://www.example.org/image.jpg' },
  europeanaIdentifier: '/123/abc',
  imageSrc: 'http://www.example.org/image.jpg' };

const factory = () => mount(MediaImage, {
  localVue,
  mocks: {
    $t: (key) => key,
    $store: {
      getters: {
        'apis/record': {
          mediaProxyUrl: () => 'proxied'
        }
      }
    }
  },
  propsData
});

describe('components/item/MediaImage', () => {
  describe('when both src and link are present', () => {
    it('shows linked image', () => {
      const wrapper = factory();

      wrapper.attributes().href.should.eq('proxied');
      wrapper.findAll('img').length.should.eq(1);
    });

    it('shows a view image link', () => {
      const wrapper = factory();
      wrapper.text().should.contain('record.view.image');
    });

    it('shows a view pdf link', () => {
      const wrapper = factory();
      const props = { media: { ebucoreHasMimeType: 'application/pdf', about: 'http://www.example.org/download.pdf' } };

      wrapper.setProps(props);
      wrapper.text().should.contain('record.view.pdf');
    });

    it('shows a view other media link', () => {
      const wrapper = factory();
      const props = { media: { ebucoreHasMimeType: 'text/html', about: 'https://sketchfab.com/models/73a52382aba8430088f1cb4a0b5784ca' } };

      wrapper.setProps(props);
      wrapper.text().should.contain('record.view.media');
    });
  });

  describe('when only src is present', () => {
    it('shows image without link', () => {
      const wrapper = factory();
      const props = { media: { } };

      wrapper.setProps(props);

      wrapper.contains('a').should.be.false;
      const image = wrapper.find('img');
      image.attributes().src.should.eq(propsData.imageSrc);
    });
  });

  describe('isPDF', () => {
    context('when ebucoreHasMimeType is "application/pdf"', () => {
      it('is `true`', () => {
        const wrapper = factory();
        const props = { media: { ebucoreHasMimeType: 'application/pdf', about: 'http://www.example.org/download.pdf' } };

        wrapper.setProps(props);
        wrapper.text().should.contain('record.view.pdf');
      });
    });
  });

  describe('isImage', () => {
    context('when ebucoreHasMimeType is "image/jpeg"', () => {
      it('is `true`', () => {
        const wrapper = factory();
        wrapper.text().should.contain('record.view.image');
      });
    });
  });
});
