import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaCard from '../../../../components/item/MediaCard.vue';

const localVue = createLocalVue();
const factory = (propsData) => shallowMount(MediaCard, {
  localVue,
  stubs: ['b-img-lazy'],
  propsData,
  mocks: {
    $t: (key) => key,
    $path: () => '/',
    $apis: {
      record: {
        mediaProxyUrl: () => 'proxied'
      }
    }
  }
});

const europeanaIdentifier = '/123/abcdef';

describe('components/item/MediaCard', () => {
  describe('isHTMLVideo', () => {
    context('when ebucoreHasMimeType is "video/ogg"', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'video/ogg', about: 'http://www.example.org/video.ogg', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLVideo.should.be.true;
      });
    });

    context('when ebucoreHasMimeType is "video/webm"', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'video/webm', about: 'http://www.example.org/video.webm', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLVideo.should.be.true;
      });
    });

    context('when ebucoreHasMimeType is "video/mp4"', () => {
      context('and edmCodecName is "h264"', () => {
        it('is `true`', () => {
          const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'video/mp4', edmCodecName: 'h264', about: 'http://www.example.org/video.mp4', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
          const wrapper = factory(props);

          wrapper.vm.isHTMLVideo.should.be.true;
        });
      });

      context('and edmCodecName is "x264"', () => {
        it('is `false`', () => {
          const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'video/mp4', edmCodecName: 'x264', about: 'http://www.example.org/video.mp4', displayImage: false, thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
          const wrapper = factory(props);

          wrapper.vm.isHTMLVideo.should.be.false;
        });
      });
    });

    context('when ebucoreHasMimeType is "image/png"', () => {
      it('is `false`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'image/png', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLVideo.should.be.false;
      });
    });
  });

  describe('isHTMLAudio', () => {
    context('when ebucoreHasMimeType is "audio/ogg"', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'audio/ogg', about: 'http://www.example.org/audio.ogg', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLAudio.should.be.true;
      });
    });

    context('when ebucoreHasMimeType is "audio/flac"', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'audio/flac', about: 'http://www.example.org/audio.flac', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLAudio.should.be.true;
      });
    });

    context('when ebucoreHasMimeType is "audio/mpeg"', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'audio/mpeg', about: 'http://www.example.org/audio.mp3', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isHTMLAudio.should.be.true;
      });
    });
  });

  describe('isOEmbed', () => {
    context('when url is for SoundCloud media', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { about: 'https://soundcloud.com/abc/def' } };
        const wrapper = factory(props);

        wrapper.vm.isOEmbed.should.be.true;
      });
    });

    context('when url is for Vimeo media', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { about: 'https://vimeo.com/abcdef' } };
        const wrapper = factory(props);

        wrapper.vm.isOEmbed.should.be.true;
      });
    });

    context('when url is for YouTube media', () => {
      it('is `true`', () => {
        const props = { europeanaIdentifier, media: { about: 'https://www.youtube.com/watch?v=abcdef' } };
        const wrapper = factory(props);

        wrapper.vm.isOEmbed.should.be.true;
      });
    });

    context('when the url is excluded from the oEmbed parser', () => {
      it('is `false`', () => {
        const props = { europeanaIdentifier, media: { about: 'https://www.example.com/watch?v=abcdef', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isOEmbed.should.be.false;
      });
    });

    context('when url is for media unknown to the oEmbed parser', () => {
      it('is `false`', () => {
        const props = { europeanaIdentifier, media: { about: 'https://example.org/abcdef', thumbnails: { isHTMLVideo: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } } };
        const wrapper = factory(props);

        wrapper.vm.isOEmbed.should.be.false;
      });
    });
  });

  describe('displayImage', () => {
    context('when imageSrc is present', () => {
      context('and media is HTML video', () => {
        it('is `false`', () => {
          const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'video/ogg', about: 'http://www.example.org/video.ogg', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } }, imageSrc: 'http://www.example.org/preview.jpg' };
          const wrapper = factory(props);

          wrapper.vm.displayImage.should.be.false;
        });
      });

      context('and url is for oEmbed media', () => {
        it('is `false`', () => {
          const props = { europeanaIdentifier, media: { about: 'https://vimeo.com/abcdef' }, imageSrc: 'http://www.example.org/preview.jpg' };
          const wrapper = factory(props);

          wrapper.vm.displayImage.should.be.false;
        });
      });

      context('and media is an image', () => {
        it('is `true`', () => {
          const props = { europeanaIdentifier, media: { ebucoreHasMimeType: 'image/png', thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' } }, imageSrc: 'http://www.example.org/preview.jpg' };
          const wrapper = factory(props);

          wrapper.vm.displayImage.should.be.true;
        });
      });
    });
  });
});
